import CommonDialog from "@/components/common/Dialog"
import { createMachineModel } from "@/services/ProductionService";
import { MachineModelData } from "@/types/production.type";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

type MachineModelFormProps = {
    refreshMachineModels: () => void;
}

const MachineModelForm: React.FC<MachineModelFormProps> = ({refreshMachineModels}) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const { control, handleSubmit, reset } = useForm<MachineModelData>({
        defaultValues : {
            machineModelName : "",
        }
    });

    const onSubmitMachineModel: SubmitHandler<MachineModelData> = async (data) => {
      
        try {
            const response = await createMachineModel(data);

            if(!response || response.statusCode !== 200) {
                toast.error("Failed to create Machine Model : " + response.message);
                return;
            } else {
                toast.success(response.message);
                setIsDialogOpen(false);
                reset();
                refreshMachineModels();
            }

        } catch (error: any) {
            toast.error("Error : " + error.message);
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