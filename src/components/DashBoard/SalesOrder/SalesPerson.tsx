import SalesPersonForm from "@/components/Form/SalesPersonForm";
import { getAllSalesPersons } from "@/services/SalesOrderService";
import { SalesPersonData } from "@/types/salesorder.type";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/Datatable/data-table";
import { columns } from "@/components/Datatable/salesperson-columns";
import { DataTableSkeleton } from "@/components/Datatable/data-table-skeleton";
import ErrorMessage from "@/components/common/ErrorMessage";

function SalesPerson() {
    const [salesPersons, setSalesPersons] = useState<SalesPersonData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const fetchSalesPersons = async () => {
        setError("");
        try {
            const response = await getAllSalesPersons();
            
            if (!response || response.statusCode !== 200) {
                setError("Error : Failed to fetch Sales Person." + response.message);
            }

            setSalesPersons(response.data || []);
        }
        catch (error: any) { 
            setError("Error : " + error.message);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSalesPersons();
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
            <div className="m-8">
                <h1 className="text-3xl font-bold border-b mb-4">Sales Person</h1>
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
            <h1 className="text-3xl font-bold border-b mb-4">Sales Person</h1>
            <div className="flex flex-col items-end mb-4">
                <SalesPersonForm refreshSalesPersons={fetchSalesPersons} />
            </div>
            <DataTable columns={columns} data={salesPersons} searchKey="sales person" />
        </div>
    );
}

export default SalesPerson;