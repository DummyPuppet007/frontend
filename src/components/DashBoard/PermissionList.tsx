import { useState, useEffect } from "react";
import { getAllPermission } from "@/services/PermissionService";
import { PermissionList as Permissions } from "@/types/permission.type";
import { DataTable } from "../Datatable/data-table";
import { columns } from "../Datatable/permission-column";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { DataTableSkeleton } from "../Datatable/data-table-skeleton";
import ErrorMessage from "../common/ErrorMessage";

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
                    setError("Error : Failed to fetch all Permissions." + response.message);
                }

                if (response.data) setPermissions(response.data)

            } catch (error: any) {
                setError("Error : " + error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchPermissions();
    }, [])

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
                <h1 className="text-3xl font-bold border-b mb-4">Permissions</h1>
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
            <div className="flex flex-col m-8">
                <h1 className="text-3xl font-bold border-b mb-4">Permissions</h1>
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