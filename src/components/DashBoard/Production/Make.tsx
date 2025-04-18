import ErrorMessage from "@/components/common/ErrorMessage";
import { DataTable } from "@/components/Datatable/data-table";
import { DataTableSkeleton } from "@/components/Datatable/data-table-skeleton";
import { columns } from "@/components/Datatable/make-columns";
import MakeForm from "@/components/Form/MakeForm";
import { getAllMakes } from "@/services/ProductionService";
import { MakeData } from "@/types/production.type";
import { useEffect, useState } from "react";

function Make() {
    const [makes, setMakes] = useState<MakeData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const fetchMakes = async () => {
        setError("");
        try {
            const response = await getAllMakes();

            if (!response || response.statusCode !== 200) {
                setError("Error : " + response.message);
            }
            setMakes(response.data || []);
        } catch (error: any) {
            setError("Error : " + error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMakes();
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
                <h1 className="pb-2 text-3xl font-medium border-b mb-4">Make</h1>
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
            <h1 className="pb-2 text-3xl font-bold border-b mb-4">Make</h1>
            <div className="flex flex-col items-end mb-4">
                <MakeForm refreshMakes={fetchMakes} />
            </div>

            <DataTable columns={columns} data={makes} searchKey="make" />
        </div>
    )
}

export default Make;