import CommonDialog from "@/Common/Dialog";
import { createMake } from "@/services/ProductionService";
import { MakeData } from "@/types/production.type";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type MakeFormProps = {
    refreshMakes: () => void;
};

const MakeForm: React.FC<MakeFormProps> = ({refreshMakes}) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const { control, handleSubmit, reset } = useForm<MakeData>({
        defaultValues : {
            makeName : "",
        }
    });

    const onSubmitMake: SubmitHandler<MakeData> = async (data) => {
        setError("");
        try {
            const response = await createMake(data);

            if (!response || response.statusCode !== 200) {
                setError(response.message);
            } else {
                setIsDialogOpen(false);
                reset();
                refreshMakes();
            }

        } catch (error: any) {
            setError(error.message);
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