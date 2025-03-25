import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getRoles } from "@/services/RoleService";
import { getAllPermission } from "@/services/PermissionService";
import CommonDialog from "@/Common/Dialog";
import { addRolePermission } from "@/services/RolePermissionService";
import { Permissions } from "@/types/permission.type";
import { Roles } from "@/types/role.type";
import { RolePermissionData } from "@/types/rolepermission.type";

function RolePermissionForm({ refreshRolePermissions }: { refreshRolePermissions: () => void }) {
    const { handleSubmit, control, reset } = useForm<RolePermissionData>();
    const [roleData, setRoleData] = useState<Roles[]>([]);
    const [permissionData, setPermissionData] = useState<Permissions[]>([]);
    const [filteredPermissions, setFilteredPermissions] = useState<Permissions[]>([]);
    const [selectedPermission, setSelectedPermission] = useState<Permissions | null>(null);
    const [error, setError] = useState<string>("");
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roles, permissions] = await Promise.all([
                    getRoles(),
                    getAllPermission()
                ]);

                if(!roles || roles.statusCode !== 200) {
                    setError("Failed to fetch roles.")
                } else if(!permissions || permissions.statusCode !== 200) {
                    setError("Failed to fetch permissions.")
                }

                if(roles.data) {
                    const formattedRoles: Roles[] = roles.data.map((role: any) => ({
                        id: role.roleId,
                        name: role.roleName
                    }));
                    setRoleData(formattedRoles);
                }
              
                if(permissions.data) {
                    const formattedPermissions: Permissions[] = permissions.data.map((permission:any) => ({
                        id: permission.permissionId,
                        name: `${permission.module.moduleName}-${permission.action.actionName}`
                    }));
                    setPermissionData(formattedPermissions);
                    setFilteredPermissions(formattedPermissions);
                }
               
               
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleSearch = (query: string) => {
        query = "";
        if (!query) {
            setFilteredPermissions(permissionData);
        } else {
            setFilteredPermissions(
                permissionData.filter((perm) =>
                    perm.name.toLowerCase().includes(query.toLowerCase())
                )
            );
        }
    };


    const handleSelect = (perm: Permissions) => {
        setSelectedPermission(perm);
    };

    const onSubmitForm = async (data: RolePermissionData) => {    
        setError("");
        try {
            const response = await addRolePermission(data);
          
            if(!response || response.statusCode !== 200) {
                setError("Failed to add role permission.")
            } else {
                setIsDialogOpen(false);
                reset();
                refreshRolePermissions();
            }
        
        } catch (error: any) {
            setError(error.message);
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
                    options: roleData,
                    placeholder: "Select Role",
                    rules: { required: "Role is required" },
                    control
                },
                {
                    name: "permissionId",
                    label: "Permission",
                    type: "searchableSelect",
                    options: filteredPermissions,
                    placeholder: "Search Permission",
                    rules: { required: "Permission is required" },
                    control,
                    onSearch: handleSearch,
                    onSelect: handleSelect
                }
            ]}
            onSubmit={handleSubmit(onSubmitForm)}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
        />
    );
}

export default RolePermissionForm;
