import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getRoles } from "@/services/RoleService";
import { getPermissionByName } from "@/services/PermissionService";
import CommonDialog from "@/components/common/Dialog"
import { addRolePermission } from "@/services/RolePermissionService";
import { Roles } from "@/types/role.type";
import { RolePermissionData } from "@/types/rolepermission.type";
import { toast } from "react-hot-toast";
import { debounce } from "lodash";
import { SearchResult } from "@/utils/types/common.types";

interface RolePermissionFormProps {
    refreshRolePermissions: () => void;
    setError: (error: string) => void;
}

function RolePermissionForm({ refreshRolePermissions, setError }: RolePermissionFormProps) {
    const { handleSubmit, control, reset } = useForm<RolePermissionData>();
    const [roles, setRoles] = useState<Roles[]>([]);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const fetchRoles = async () => {
        try {
            const response = await getRoles();

            if (!response || response.statusCode !== 200) {
                setError("Error : Failed to fetch roles." + response.message);
            }

            if (response.data) {
                const formatRoles: Roles[] = response.data.map((role: any) => ({
                    id: role.roleId,
                    name: role.roleName
                }));
                setRoles(formatRoles);
            }
        } catch (error: any) {
            setError("Error : " + error.message);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

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
                    setSearchResults(formatPermission);
                }

            } else {
                setSearchResults([]);
            }
        }, 300),
        []
    );

    const onSubmitForm = async (data: RolePermissionData) => {
        try {
            const response = await addRolePermission(data);

            if (!response || response.statusCode !== 200) {
                toast.error("Error : Failed to create Role Permission. " + response.message);
                return;
            } else {
                toast.success("Role Permission created successfully.");
                setIsDialogOpen(false);
                reset();
                refreshRolePermissions();
            }
        } catch (error: any) {
            toast.error("Error : " + error.message);
        }
    };

    return (
        <CommonDialog
            title="Add Role Permission"
            description="Select Role and Permission here. Click save when you're done."
            triggerText="Add Role Permission"
            fields={[
                {
                    name: "roleId",
                    label: "Role",
                    type: "select",
                    options: roles,
                    placeholder: "Select Role",
                    rules: { required: "Role is required" },
                    control
                },
                {
                    name: "permissionId",
                    label: "Permission",
                    type: "searchableSelect",
                    options: searchResults,
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

export default RolePermissionForm;
