import { useEffect, useState } from "react";
import { RolePermissionList } from "@/types/rolepermission.type";
import { getAllRolePermissions } from "@/services/RolePermissionService";
import { DataTable } from "../Datatable/data-table";
import { columns } from "../Datatable/roleperm-columns";
import RolePermissionForm from "../Form/RolePermissionForm";
import { DataTableSkeleton } from "../Datatable/data-table-skeleton";
import ErrorMessage from "../common/ErrorMessage";

function RolePermission() {
    const [rolePermissions, setRolePermissions] = useState<RolePermissionList[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        fetchRolePermissions();
    }, [])

    const fetchRolePermissions = async () => {
        setError("")
        try {
            const response = await getAllRolePermissions();

            if (!response || response.statusCode !== 200) {
                setError("Error : Failed to fetch Role Permissions." + response.message);
            }

            setRolePermissions(response.data || []);

        } catch (error: any) {
            setError("Error : " + error.message);
        } finally {
            setLoading(false);
        }
    }

    if (error) {
        return (
            <div className="m-8">
                <ErrorMessage message={error} className="mb-8" />
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
                <h1 className="text-3xl font-bold border-b mb-4">Role Permissions</h1>
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
            <h1 className="text-3xl font-bold border-b mb-4">Role Permissions</h1>
            <div className="flex flex-col items-end mb-4">
                <RolePermissionForm 
                    refreshRolePermissions={fetchRolePermissions} 
                    setError={setError}
                />
            </div>
            <DataTable columns={columns} data={rolePermissions} searchKey="role permission" />
        </div>
    )
}

export default RolePermission;