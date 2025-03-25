import CommonDialog from "@/Common/Dialog";
import { createMachineModel } from "@/services/ProductionService";
import { MachineModelData } from "@/types/production.type";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type MachineModelFormProps = {
    refreshMachineModels: () => void;
}

const MachineModelForm: React.FC<MachineModelFormProps> = ({refreshMachineModels}) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const { control, handleSubmit, reset } = useForm<MachineModelData>({
        defaultValues : {
            machineModelName : "",
        }
    });

    const onSubmitMachineModel: SubmitHandler<MachineModelData> = async (data) => {
        setError("");
        try {
            const response = await createMachineModel(data);

            if(!response || response.statusCode !== 200) {
                setError(response.message);
            } else {
                setIsDialogOpen(false);
                reset();
                refreshMachineModels();
            }

        } catch (error: any) {
            setError(error.message);
        }
    }
    
    return(
        <CommonDialog
            title="Add Machine Model"
            description="Enter Machine Model Name. Click save when done."
            triggerText="Add Machine Model"
            fields={[
                {
                    name: "machineModelName",
                    control,
                    label: "Machine Model",
                    type: "text",
                    placeholder: "Enter machine model name",
                    rules: { required: "Machine model name is required", minLength: { value: 2, message: "At least 2 characters required" } },
                },
            ]}
            onSubmit={handleSubmit(onSubmitMachineModel)}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
        />
    )
}

export default MachineModelForm;