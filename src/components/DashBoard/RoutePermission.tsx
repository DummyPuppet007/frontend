import { getAllRoutePermissions } from "@/services/RoutePermissionService";
import { RoutePermissionList } from "@/types/routepermission.type";
import { useEffect, useState } from "react";
import RoutePermissionForm from "../Form/RoutePermissionForm";
import { DataTable } from "../Datatable/data-table";
import { columns } from "../Datatable/routeperm-columns";
import { DataTableSkeleton } from "../Datatable/data-table-skeleton";

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
                setError("Failed to fetch route permissions.")
            }

            setRoutePermissions(response.data || [])
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="py-4 px-2 w-full">
                <h1 className="pb-2 text-3xl font-medium border-b mb-4">Route Permissions</h1>
                <hr className="mb-5" />
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
            <h1 className="pb-2 text-3xl font-medium border-b mb-4">Route Permissions</h1>
            <div className="flex flex-col items-end mb-4">
                <RoutePermissionForm refreshRoutePermissions={fetchRoutePermissions} />
            </div>
            <DataTable columns={columns} data={routePermissions} searchKey="route permission" />
        </div>
    )
}

export default RoutePermission;