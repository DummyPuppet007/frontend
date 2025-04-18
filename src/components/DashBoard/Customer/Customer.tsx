import CustomerForm from "@/components/Form/CustomerForm";
import { getCustomerDetail } from "@/services/CustomerService";
import { CustomerData } from "@/types/customer.type";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorMessage from "@/components/common/ErrorMessage";
import { CustomerFormSkeleton } from "@/components/common/Skeletons";

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
                setError("Error : " + response.message);
                return;
            }

            setCustomer(response.data);
        } catch (error: any) {  
            setError("Error : "+error.message);
        }
    }

    useEffect(() => {
        fetchCustomerDetail();
    },[id])

    if(error){
        return(
            <div className="m-8">
                <ErrorMessage message={error} />
                <CustomerFormSkeleton />
            </div>
        )
    }

    return(
        <div className="m-8">
            <CustomerForm initialData={customer}/>
        </div>
    )
}

export default Customer;