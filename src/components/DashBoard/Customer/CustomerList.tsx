import { columns } from "@/components/Datatable/customer-columns";
import { DataTable } from "@/components/Datatable/data-table";
import { getAllCustomers } from "@/services/CustomerService";
import { CustomerData } from "@/types/customer.type";
import { useEffect, useState } from "react";
import CustomerDetail from "./CustomerDetail";
import { DataTableSkeleton } from "@/components/Datatable/data-table-skeleton";
import ErrorMessage from "@/components/common/ErrorMessage";

function CustomerList() {
    const [customers, setCustomers] = useState<CustomerData[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    
    const handleCustomerDetail = (customer: CustomerData) => {
        setSelectedCustomer(customer);
    };

    const fetchCustomers = async () => {
        setError("");
        try {
            const response = await getAllCustomers();
            
            if (!response || response.statusCode !== 200) {
                setError("Error : " + response.message);
                return;
            }

            setCustomers(response.data || []);
        } catch (error: any) {
            setError("Error : " + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    if (error) {
        return (
            <div className="m-8">
                <ErrorMessage message={error} className="mb-8" />
                <DataTableSkeleton 
                    columnCount={5} 
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
                <h1 className="pb-2 text-3xl font-bold border-b mb-4">Customer List</h1>
                <DataTableSkeleton 
                    columnCount={5} 
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
            <h1 className="pb-2 text-3xl font-bold border-b mb-4">Customer List</h1>
            <DataTable columns={columns(handleCustomerDetail)} data={customers} searchKey="customer" />
            <CustomerDetail
                customer={selectedCustomer}
                onClose={() => setSelectedCustomer(null)}
            />
        </div>
    );
}

export default CustomerList;

