import { Users } from "@/types/user.type";
import { useCallback, useEffect, useState } from "react";
import { getAllUsers } from "@/services/UserService";
import CommonDialog from "@/components/common/Dialog"
import { useForm } from "react-hook-form";
import { UserPermissionData } from "@/types/userpermission.type";
import { addUserPermission } from "@/services/UserPermissionService";
import { toast } from "react-hot-toast";
import { SearchResult } from "@/utils/types/common.types";
import { debounce } from "lodash";
import { getPermissionByName } from "@/services/PermissionService";

interface UserPermissionFormProps {
    refreshUserPermissions: () => void;
    setError: (error: string) => void;
}

function UserPermissionForm({ refreshUserPermissions, setError }: UserPermissionFormProps) {
    const { handleSubmit, control, reset } = useForm<UserPermissionData>();
    const [users, setUsers] = useState<Users[]>([]);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const fetchUsers = async () => {
        try {
            const response = await getAllUsers();

            if (!response || response.statusCode !== 200) {
                setError("Error : Failed to fetch Users." + response.message);
            }

            if (response.data) {
                const formatUsers: Users[] = response.data.map((user: any) => ({
                    id: user.userId,
                    name: `${user.firstname} ${user.lastname}`
                }));
                setUsers(formatUsers);
            }

        } catch (error: any) {
            setError("Error : " + error.message);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, [])

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

    const onSubmitForm = async (data: UserPermissionData) => {
        setError("");
        try {
            const response = await addUserPermission(data);

            if (!response || response.statusCode !== 200) {
                toast.error("Error : Failed to add User Permission." + response.message);
                return;
            } else {
                toast.success("User Permission created successfully.");
                setIsDialogOpen(false);
                reset();
                refreshUserPermissions();
            }
        } catch (error: any) {
            toast.error("Error : " + error.message);
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
                    options: users,
                    placeholder: "Select User",
                    rules: { required: "User is required" },
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
    )
}

export default UserPermissionForm;