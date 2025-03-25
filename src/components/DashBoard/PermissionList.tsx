import { useState, useEffect } from "react";
import { getAllPermission } from "@/services/PermissionService";
import { PermissionList as Permissions } from "@/types/permission.type";
import { DataTable } from "../Datatable/data-table";
import { columns } from "../Datatable/permission-column";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { DataTableSkeleton } from "../Datatable/data-table-skeleton";

function PermissionList() {
    const navigate = useNavigate();
    const [permissions, setPermissions] = useState<Permissions[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchPermissions = async () => {
            setError("")
            setLoading(true)
            try {
                const response = await getAllPermission();

                if (!response || response.statusCode !== 200) {
                    setError('Failed to fetch permissions.')
                }

                if (response.data) setPermissions(response.data)

            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchPermissions();
    }, [])

    if (loading) {
        return (
            <div className="py-4 px-2 w-full">
                <h1 className="pb-2 text-3xl font-medium border-b mb-4">Permissions</h1>
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
        <>
            <div className="py-4 px-2 w-full">
                <h1 className="pb-2 text-3xl font-medium border-b mb-4">Permissions</h1>
                <div className="flex flex-col items-end mb-4">

                    <Button
                        onClick={() => navigate("/dashboard/auth/add-permission")}
                        className=""
                    >
                        Add Permission
                    </Button>

                </div>
                <DataTable columns={columns} data={permissions} searchKey="permission" />
            </div>

        </>
    )
}

export default PermissionList;