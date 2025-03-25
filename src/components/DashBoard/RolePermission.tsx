import { useEffect, useState } from "react";
import { RolePermissionList } from "@/types/rolepermission.type";
import { getAllRolePermissions } from "@/services/RolePermissionService";
import { DataTable } from "../Datatable/data-table";
import { columns } from "../Datatable/roleperm-columns";
import RolePermissionForm from "../Form/RolePermissionForm";
import { DataTableSkeleton } from "../Datatable/data-table-skeleton";

function RolePermission() {
    const [rolePermissions, setRolePermissions] = useState<RolePermissionList[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        fetchRolePermissions();
    }, [])

    const fetchRolePermissions = async () => {
        setError("")
        setLoading(true)
        try {
            const response = await getAllRolePermissions();

            if (!response || response.statusCode !== 200) {
                setError('Failed to fetch role permissions.')
            }

            if (response.data) setRolePermissions(response.data)

        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="py-4 px-2 w-full">
                <h1 className="pb-2 text-3xl font-medium border-b mb-4">Role Permissions</h1>
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
            <h1 className="pb-2 text-3xl font-medium border-b mb-4">Role Permissions</h1>
            <div className="flex flex-col items-end mb-4">
                <RolePermissionForm refreshRolePermissions={fetchRolePermissions} />
            </div>
            <DataTable columns={columns} data={rolePermissions} searchKey="role permission" />
        </div>
    )
}

export default RolePermission;