import { getAllRoutePermissions } from "@/services/RoutePermissionService";
import { RoutePermissionList } from "@/types/routepermission.type";
import { useEffect, useState } from "react";
import RoutePermissionForm from "../Form/RoutePermissionForm";
import { DataTable } from "../Datatable/data-table";
import { columns } from "../Datatable/routeperm-columns";
import { DataTableSkeleton } from "../Datatable/data-table-skeleton";
import ErrorMessage from "../common/ErrorMessage";

function RoutePermission() {
    const [routePermissions, setRoutePermissions] = useState<RoutePermissionList[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        fetchRoutePermissions();
    }, [])

    const fetchRoutePermissions = async () => {
        setError("");
        try {
            const response = await getAllRoutePermissions();

            if (!response || response.statusCode !== 200) {
                setError("Failed to fetch Route Permissions." + response.message);
            }

            setRoutePermissions(response.data || [])
        } catch (error: any) {
            setError("Error : " + error.message);
        } finally {
            setLoading(false);
        }
    }

    if(error) {
        return(
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
                <h1 className="text-3xl font-bold border-b mb-4">Route Permissions</h1>
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
            <h1 className="text-3xl font-bold border-b mb-4">Route Permissions</h1>
            <div className="flex flex-col items-end mb-4">
                <RoutePermissionForm 
                    refreshRoutePermissions={fetchRoutePermissions} 
                    setError={setError}
                />
            </div>
            <DataTable columns={columns} data={routePermissions} searchKey="route permission" />
        </div>
    )
}

export default RoutePermission;