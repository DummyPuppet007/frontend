import CommonDialog from "@/components/common/Dialog"
import { createSalesPerson } from "@/services/SalesOrderService";
import { SalesPersonData } from "@/types/salesorder.type";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

type SalesPersonFormProps = {
    refreshSalesPersons: () => void;
};

const SalesPersonForm: React.FC<SalesPersonFormProps> = ({refreshSalesPersons}) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const { handleSubmit, control, reset } = useForm<SalesPersonData>({
        defaultValues: {
            salesPersonName: "",
            abbrev: "",
        }
    });

    const onSubmitSalesPerson: SubmitHandler<SalesPersonData> = async (data) => {    
        try {
            const response = await createSalesPerson(data);
            
            if (!response || response.statusCode !== 200) {
                toast.error("Failed to create Sales Person : "+response.message);
                return;
            } else {
                toast.success("Sales Person created successfully.");
                setIsDialogOpen(false);
                reset();
                refreshSalesPersons();
            }
        } catch (error: any) {
            toast.error("Error : "+ error.message);
        }
    }

    return(
        <CommonDialog
            title="Create Sales Person"
            description="Enter Sales Person Name and Abbreviation. Click save when done."
            triggerText="Create Sales Person"
            fields={[
                {
                    name: "salesPersonName",
                    control,
                    label: "Sales Person",
                    type: "text",
                    placeholder: "Enter Sales Person name",
                    rules: { required: "Sales Person name is required", minLength: { value: 2, message: "At least 2 characters required" } },
                },
                {
                    name: "abbrev",
                    control,
                    label: "Abbreviation",
                    type: "text",
                    placeholder: "Enter abbreviation (e.g., James Smith → JS)",
                    rules: { required: "Abbreviation is required" },
                },
            ]}    
            onSubmit={handleSubmit(onSubmitSalesPerson)}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
        />
    )
}

export default SalesPersonForm;