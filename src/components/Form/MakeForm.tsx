import CommonDialog from "@/components/common/Dialog"
import { createMake } from "@/services/ProductionService";
import { MakeData } from "@/types/production.type";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

type MakeFormProps = {
    refreshMakes: () => void;
};

const MakeForm: React.FC<MakeFormProps> = ({refreshMakes}) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const { control, handleSubmit, reset } = useForm<MakeData>({
        defaultValues : {
            makeName : "",
        }
    });

    const onSubmitMake: SubmitHandler<MakeData> = async (data) => {
        try {
            const response = await createMake(data);

            if (!response || response.statusCode !== 200) {
                toast.error("Failed to create Make : " + response.message);
            } else {
                toast.success(response.message);
                setIsDialogOpen(false);
                reset();
                refreshMakes();
            }

        } catch (error: any) {
            toast.error("Error : " + error.message);
        }
    }

    return(
        <CommonDialog
            title="Add Make"
            description="Enter Make Name. Click save when done."
            triggerText="Add Make"
            fields={[
                {
                    name: "makeName",
                    control,
                    label: "Enter Make",
                    type: "text",
                    placeholder: "Enter make name",
                    rules: { required: "Make name is required", minLength: { value: 2, message: "At least 2 characters required" } },
                },
            ]}
            onSubmit={handleSubmit(onSubmitMake)}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
        />  
    )
}

export default MakeForm;