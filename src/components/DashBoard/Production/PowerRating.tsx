import { DataTable } from "@/components/Datatable/data-table";
import { DataTableSkeleton } from "@/components/Datatable/data-table-skeleton";
import { columns } from "@/components/Datatable/powerrating-columns";
import PowerRatingForm from "@/components/Form/PowerRatingForm";
import { getAllPowerRatings } from "@/services/ProductionService";
import { PowerRatingData } from "@/types/production.type";
import { useEffect, useState } from "react";

function PowerRating() {
    const [powerRatings, setPowerRatings] = useState<PowerRatingData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        fetchPowerRatings();
    }, [])

    const fetchPowerRatings = async () => {
        setError("");
        try {
            const response = await getAllPowerRatings();
            if (!response || response.statusCode !== 200) {
                setError(response.message);
            }
            setPowerRatings(response.data || []);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="py-4 px-2 w-full">
                <h1 className="pb-2 text-3xl font-medium border-b mb-4">Power Rating</h1>
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
            <h1 className="pb-2 text-3xl font-medium border-b mb-4">Power Rating</h1>
            <div className="flex flex-col items-end mb-4">
                <PowerRatingForm refreshPowerRatings={fetchPowerRatings} />
            </div>

            <DataTable columns={columns} data={powerRatings} searchKey="power rating" />
        </div>
    )
}

export default PowerRating;