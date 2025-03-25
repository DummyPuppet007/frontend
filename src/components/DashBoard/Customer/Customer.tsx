import CustomerForm from "@/components/Form/CustomerForm";
import { getCustomerDetail } from "@/services/CustomerService";
import { CustomerData } from "@/types/customer.type";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Customer(){
    const [customer, setCustomer] = useState<CustomerData | null>(null);
    const {id} = useParams<{ id: string }>();
    const [error, setError] = useState<string>("");

    const fetchCustomerDetail = async () => {
        if (!id) {
            return;
        }

        try {
            const response = await getCustomerDetail(Number(id));
            
            if(!response || response.statusCode !== 200) {
                setError('Customer Detail Not Found.');
            }

            setCustomer(response.data);
        } catch (error: any) {
            setError(error.message);
        }
    }

    useEffect(() => {
        fetchCustomerDetail();
    },[id])

    return(
        <div className="py-4 px-2 w-full">
            <CustomerForm initialData={customer}/>
        </div>
    )
}

export default Customer;