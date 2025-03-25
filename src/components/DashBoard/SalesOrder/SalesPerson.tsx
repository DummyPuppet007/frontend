import SalesPersonForm from "@/components/Form/SalesPersonForm";
import { getAllSalesPersons } from "@/services/SalesOrderService";
import { SalesPersonData } from "@/types/salesorder.type";
// import { AlertTriangle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
import { DataTable } from "@/components/Datatable/data-table";
import { columns } from "@/components/Datatable/salesperson-columns";
import { DataTableSkeleton } from "@/components/Datatable/data-table-skeleton";

function SalesPerson() {
    const [salesPersons, setSalesPersons] = useState<SalesPersonData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const fetchSalesPersons = async () => {
        setError("");
        try {
            const response = await getAllSalesPersons();
            
            if (!response || response.statusCode !== 200) {
                setError(response.message);
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

    // if (error) {
    //     return (
    //         <motion.div
    //             initial={{ opacity: 0, y: -50 }}
    //             animate={{ opacity: 1, y: 0 }}
    //             transition={{ duration: 0.6, ease: "easeOut" }} className="p-4">
    //             <div className="bg-red-500 text-white font-medium border border-red-700 p-3 rounded-lg shadow-md flex items-center w-full  relative">
    //                 <AlertTriangle className="size-5 mr-2" />
    //                 <p className="flex-grow">{error}</p>
    //                 <button
    //                     onClick={() => setError("")}
    //                     className="ml-4 focus:outline-none"
    //                 >
    //                     <XCircle className="size-5 hover:text-gray-200 transition" />
    //                 </button>
    //             </div>
    //         </motion.div>
            
    //     );
    // }

    if (loading) {
        return (
            <div className="container py-8">
                <h1 className="pb-2 text-3xl font-medium">Sales Person</h1>
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
        <div className="container py-8">
            <h1 className="pb-2 text-3xl font-medium">Sales Person</h1>
            <hr className="mb-5" />
            <div className="flex flex-col items-end mb-4">
                <SalesPersonForm refreshSalesPersons={fetchSalesPersons} />
            </div>
            <DataTable columns={columns} data={salesPersons} searchKey="sales person" />
        </div>
    )
}

export default SalesPerson;