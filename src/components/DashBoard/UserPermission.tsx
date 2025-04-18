import { useEffect, useState } from "react";
import { UserPermissionList } from "@/types/userpermission.type";
import { getAllUserPermissions } from "@/services/UserPermissionService";
import { DataTable } from "../Datatable/data-table";
import { columns } from "../Datatable/userperm-columns";
import UserPermissionForm from "../Form/UserPermissionForm";
import { DataTableSkeleton } from "../Datatable/data-table-skeleton";
import ErrorMessage from "../common/ErrorMessage";

function UserPermission() {
    const [userPermissions, setUserPermissions] = useState<UserPermissionList[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        fetchUserPermissions();
    }, [])

    const fetchUserPermissions = async () => {
        setError("")
        try {
            const response = await getAllUserPermissions();
            
            if (!response || response.statusCode !== 200) {
                setError("Error : Failed to fetch User Permissions." + response.message);
            }
       
            setUserPermissions(response.data || []);
        } catch (error: any) {
            setError("Error : " + error.message);
        } finally {
            setLoading(false);
        }
    }

    if(error) {
        return(
            <div className="m-8">
                <ErrorMessage message={error} className="mb-8"/>
                <DataTableSkeleton
                    columnCount={columns.length}
                    rowCount={10}
                    searchableColumnCount={1}
                    showViewOptions={true}
                    withPagination={true}
                    shrinkZero={false}
                />
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex flex-col m-8">
                <h1 className="text-3xl font-bold border-b mb-4">User Permissions</h1>
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
        <div className="flex flex-col m-8">
            <h1 className="text-3xl font-bold border-b mb-4">User Permissions</h1>
            <div className="flex flex-col items-end mb-4">
                <UserPermissionForm 
                    refreshUserPermissions={fetchUserPermissions} 
                    setError={setError}
                />
            </div>
            <DataTable columns={columns} data={userPermissions} searchKey="user permission" />
        </div>
    )
}

export default UserPermission;