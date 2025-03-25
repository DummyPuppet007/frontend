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
                setError(response.message);
            }
            setMakes(response.data || []);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMakes();
    }, [])

    if (loading) {
        return (
            <div className="py-4 px-2 w-full">
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
        <div className="py-4 px-2 w-full">
            <h1 className="pb-2 text-3xl font-medium border-b mb-4">Make</h1>
            <div className="flex flex-col items-end mb-4">
                <MakeForm refreshMakes={fetchMakes} />
            </div>

            <DataTable columns={columns} data={makes} searchKey="make" />
        </div>
    )
}

export default Make;