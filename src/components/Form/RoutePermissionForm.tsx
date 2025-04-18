import CommonDialog from "@/components/common/Dialog"
import { getPermissionByName } from "@/services/PermissionService";
import { addRoutePermission } from "@/services/RoutePermissionService";
import { getRoutesByName } from "@/services/RouteService";
import { RoutePermissionData } from "@/types/routepermission.type";
import { SearchResult } from "@/utils/types/common.types";
import { debounce } from "lodash";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

interface RoutePermissionFormProps {
    refreshRoutePermissions: () => void;
    setError: (error: string) => void;
}

function RoutePermissionForm({ refreshRoutePermissions, setError }: RoutePermissionFormProps) {
    const { handleSubmit, control, reset } = useForm<RoutePermissionData>();
    const [searchRouteResults, setSearchRouteResults] = useState<SearchResult[]>([]);
    const [searchPermResults, setSearchPermResults] = useState<SearchResult[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const handleSearchPermission = useCallback(
        debounce(async (query: string) => {
            if (query.length >= 2) {
                const response = await getPermissionByName(query);
                if (!response || response.statusCode !== 200 || !response.data) {
                    setError("Error : Failed to fetch permissions." + response.message);
                } else {
                    const formatPermission = response.data.map((permission: any) => ({
                        id: permission.permissionId,
                        name: `${permission.module.moduleName} - ${permission.action.actionName}`,
                    }))
                    setSearchPermResults(formatPermission);
                }

            } else {
                setSearchPermResults([]);
            }
        }, 300),
        []
    );

    const handleSearchRoute = useCallback(
        debounce(async (query: string) => {
            if (query.length >= 2) {
                const response = await getRoutesByName(query);
                if (!response || response.statusCode !== 200 || !response.data) {
                    setError("Error : Failed to fetch routes." + response.message);
                } else {
                    const formatRoute = response.data.map((route: any) => ({
                        id: route.routeId,
                        name: `${route.httpMethod} - ${route.routeName}`
                    }))
                    setSearchRouteResults(formatRoute);
                }
            } else {
                setSearchRouteResults([]);
            }
        }, 300),
        []
    );

    const onSubmitForm = async (data: RoutePermissionData) => {
        try {
            const response = await addRoutePermission(data);
            if (!response || response.statusCode !== 200) {
                toast.error("Error : " + response.message);
                return;
            } else {
                toast.success(response.message);
                setIsDialogOpen(false);
                reset();
                refreshRoutePermissions();
            }
        } catch (error: any) {
            toast.error("Error : " + error.message);
        }
    };

    return (
        <CommonDialog
            title="Add Route Permission"
            description="Select Route and Permission here. Click save when you're done."
            triggerText="Add Route Permission"
            fields={[
                {
                    name: "routeId",
                    label: "Routes",
                    type: "searchableSelect",
                    options: searchRouteResults,
                    placeholder: "Search Routes",
                    rules: { required: "Route is required" },
                    control,
                    onSearch: handleSearchRoute
                },
                {
                    name: "permissionId",
                    label: "Permission",
                    type: "searchableSelect",
                    options: searchPermResults,
                    placeholder: "Search Permission",
                    rules: { required: "Permission is required" },
                    control,
                    onSearch: handleSearchPermission,
                }
            ]}
            onSubmit={handleSubmit(onSubmitForm)}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
        />
    );
}

export default RoutePermissionForm;

