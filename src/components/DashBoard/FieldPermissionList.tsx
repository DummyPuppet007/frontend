import { getAllFieldPermissions } from "@/services/FieldPermissionService";
import { FieldPermissions } from "@/types/fieldpermission.type";
import { useEffect, useState } from "react";
import { DataTable } from "../Datatable/data-table";
import { columns } from "../Datatable/fieldperm-columns";
import { DataTableSkeleton } from "../Datatable/data-table-skeleton";
import ErrorMessage from "../common/ErrorMessage";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

function FieldPermissionList() {

    const [fieldPermissions, setFieldPermissions] = useState<FieldPermissions[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const fetchFieldPermissions = async () => {
        setError("");
        try {
            const response = await getAllFieldPermissions();

            setFieldPermissions(response.data || []);

            if (!response || response.statusCode !== 200) {
                setError("Error : Failed to fetch all Field Permissions." + response.message);
            }
        } catch (error: any) {
            setError("Error : " + error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchFieldPermissions();
    }, [])

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
                <h1 className="text-3xl font-bold border-b mb-4">Field Permissions</h1>
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
                <h1 className="text-3xl font-bold border-b mb-4">Field Permissions</h1>
                <div className="flex flex-col items-end mb-4">
                    <Button
                        onClick={() => navigate("/dashboard/auth/create-field-permission")}
                        className=""
                    >
                        Add Field Permission
                    </Button>
                </div>
                <DataTable columns={columns} data={fieldPermissions} searchKey="field permission" />
            </div>

        </>
    )
}

export default FieldPermissionList;