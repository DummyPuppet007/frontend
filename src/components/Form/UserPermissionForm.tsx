import { Users } from "@/types/user.type";
import { useEffect, useState } from "react";
import { getAllUsers } from "@/services/UserService";
import { getAllPermission } from "@/services/PermissionService";
import CommonDialog from "@/Common/Dialog";
import { useForm } from "react-hook-form";
import { UserPermissionData } from "@/types/userpermission.type";
import { addUserPermission } from "@/services/UserPermissionService";
import { Permissions } from "@/types/permission.type";

function UserPermissionForm({ refreshUserPermissions }: { refreshUserPermissions: () => void }) {
    const { handleSubmit, control, reset } = useForm<UserPermissionData>();
    const [userData, setUserData] = useState<Users[]>([])
    const [permissionData, setPermissionData] = useState<Permissions[]>([]);
    const [filteredPermissions, setFilteredPermissions] = useState<Permissions[]>([]);
    const [selectedPermission, setSelectedPermission] = useState<Permissions | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [users, permissions] = await Promise.all([
                    getAllUsers(),
                    getAllPermission()
                ])
                if (!users || users.statusCode !== 200) {
                    setError("Failed to fetch users.")
                } else if (!permissions || permissions.statusCode !== 200) {
                    setError("Failed to fetch permissions.")
                }

                if (users.data) {
                    const formattedUsers: Users[] = users.data.map((user: any) => ({
                        id: user.userId,
                        name: `${user.firstname} ${user.lastname}`
                    }));
                    setUserData(formattedUsers);
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
        }
        fetchData();
    }, [])

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

    const onSubmitForm = async (data: UserPermissionData) => { 
        setError("");
        try {
            const response = await addUserPermission(data);
            if (!response || response.statusCode !== 200) {
                setError("Failed to add role permission.")
            } else {
                setIsDialogOpen(false);
                reset();
                refreshUserPermissions();
            }
        } catch (error: any) {
            setError(error.message);
        }
    }

    return (
        <CommonDialog
            title="Add User Permission"
            description="Select User and Permission here. Click save when you're done."
            triggerText="Add User Permission"
            fields={[
                {
                    name: "userId",
                    label: "User",
                    type: "select",
                    options: userData,
                    placeholder: "Select User",
                    rules: { required: "User is required" },
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
    )
}

export default UserPermissionForm;