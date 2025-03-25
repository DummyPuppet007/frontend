import { useEffect, useState } from "react";
import { UserPermissionList } from "@/types/userpermission.type";
import { getAllUserPermissions } from "@/services/UserPermissionService";
import { DataTable } from "../Datatable/data-table";
import { columns } from "../Datatable/userperm-columns";
import UserPermissionForm from "../Form/UserPermissionForm";
import { DataTableSkeleton } from "../Datatable/data-table-skeleton";

function UserPermission() {
    const [userPermissions, setUserPermissions] = useState<UserPermissionList[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        fetchUserPermissions();
    }, [])

    const fetchUserPermissions = async () => {
        setError("")
        setLoading(true)
        try {
            const response = await getAllUserPermissions();
           
            if (!response || response.statusCode !== 200) {
                setError("Failed to fetch user permissions.")
            }
       
            setUserPermissions(response.data || []);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="py-4 px-2 w-full">
                <h1 className="pb-2 text-3xl font-medium border-b mb-4">User Permissions</h1>
                <DataTableSkeleton
                    columnCount={columns.length}
                    rowCount={10}
                    searchableColumnCount={1}
                    showViewOptions={true}
                    withPagination={true}
                    shrinkZero={false}
                />
            </div>
        );
    }

    return (
        <div className="py-4 px-2 w-full">
            <h1 className="pb-2 text-3xl font-medium border-b mb-4">User Permissions</h1>
            <div className="flex flex-col items-end mb-4">
                <UserPermissionForm refreshUserPermissions={fetchUserPermissions}/>
            </div>
            <DataTable columns={columns} data={userPermissions} searchKey="user permission" />
        </div>
    )
}

export default UserPermission;