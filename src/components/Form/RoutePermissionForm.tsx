import CommonDialog from "@/Common/Dialog";
import { getAllPermission } from "@/services/PermissionService";
import { addRoutePermission } from "@/services/RoutePermissionService";
import { getAllRoutes } from "@/services/RouteService";
import { Permissions } from "@/types/permission.type";
import { Routes } from "@/types/route.type";
import { RoutePermissionData } from "@/types/routepermission.type";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function RoutePermissionForm({ refreshRoutePermissions }: { refreshRoutePermissions: () => void }) {
    const { handleSubmit, control, reset } = useForm<RoutePermissionData>();
    const [routeData, setRouteData] = useState<Routes[]>([]);
    const [filteredRoutes, setFilteredRoutes] = useState<Routes[]>([]);
    const [permissionData, setPermissionData] = useState<Permissions[]>([]);
    const [filteredPermissions, setFilteredPermissions] = useState<Permissions[]>([]);
    const [selectedPermission, setSelectedPermission] = useState<Permissions | null>(null);
    const [selectedRoute, setSelectedRoute] = useState<Routes | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [routes, permissions] = await Promise.all([
                    getAllRoutes(),
                    getAllPermission()
                ]);
             
                if (!routes || routes.statusCode !== 200) {
                    setError("Failed to fetch routes.");
                } else if (!permissions || permissions.statusCode !== 200) {
                    setError("Failed to fetch permissions.");
                }

                if (routes.data) {
                    const formattedRoutes: Routes[] = routes.data.map((route: any) => ({
                        id: route.routeId,
                        name:`${route.httpMethod} - ${route.routeName}` 
                    }));

                    setRouteData(formattedRoutes);
                    setFilteredRoutes(formattedRoutes);
                }

                if (permissions.data) {
                    const formattedPermissions: Permissions[] = permissions.data.map((permission: any) => ({
                        id: permission.permissionId,
                        name: `${permission.module.moduleName}-${permission.action.actionName}`
                    }));
                    setPermissionData(formattedPermissions);
                    setFilteredPermissions(formattedPermissions);
                }
            } catch (error: any) {
                setError(error.message);
            }
        };   
        fetchData();
    }, []);

    const handleSearch = (query: string, type: "route" | "permission") => {
        if (!query) {
            if (type === "route") setFilteredRoutes(routeData);
            else setFilteredPermissions(permissionData);
        } else {
            if (type === "route") {
                setFilteredRoutes(
                    routeData.filter((route) =>
                        route.name.toLowerCase().includes(query.toLowerCase())
                    )
                );
            } else {
                setFilteredPermissions(
                    permissionData.filter((perm) =>
                        perm.name.toLowerCase().includes(query.toLowerCase())
                    )
                );
            }
        }
    };

    const handleSelect = (item: Routes | Permissions, type: "route" | "permission") => {
        if (type === "route") setSelectedRoute(item as Routes);
        else setSelectedPermission(item as Permissions);
    };

    const onSubmitForm = async (data: RoutePermissionData) => { 
        setError("");
        try {
            const response = await addRoutePermission(data);
            if (!response || response.statusCode !== 200) {
                setError("Failed to add route permission.");
            } else {
                setIsDialogOpen(false);
                reset();
                refreshRoutePermissions();
            }
        } catch (error: any) {
            setError(error.message);
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
                    options: filteredRoutes,
                    placeholder: "Search Routes",
                    rules: { required: "Route is required" },
                    control,
                    onSearch: (query: string) => handleSearch(query, "route"),
                    onSelect: (item: Routes) => handleSelect(item, "route")
                },
                {
                    name: "permissionId",
                    label: "Permission",
                    type: "searchableSelect",
                    options: filteredPermissions,
                    placeholder: "Search Permission",
                    rules: { required: "Permission is required" },
                    control,
                    onSearch: (query: string) => handleSearch(query, "permission"),
                    onSelect: (item: Permissions) => handleSelect(item, "permission")
                }
            ]}
            onSubmit={handleSubmit(onSubmitForm)}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
        />
    );
}

export default RoutePermissionForm;
