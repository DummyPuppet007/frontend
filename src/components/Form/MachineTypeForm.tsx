import CommonDialog from "@/Common/Dialog";
import { createMachineType } from "@/services/ProductionService";
import { MachineTypeData } from "@/types/production.type";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type MachineTypeFormProps = {
    refreshMachineTypes : () => void;
}

const MachineTypeForm: React.FC<MachineTypeFormProps> = ({refreshMachineTypes}) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const { handleSubmit, control, reset } = useForm<MachineTypeData>({
        defaultValues: {
            machineTypeName : "",
        }
    });

    const onSubmitMachineType: SubmitHandler<MachineTypeData> = async (data) => {
        setError("");
        try {
            const response = await createMachineType(data);

            if(!response || response.statusCode !== 200){
                setError(response.message);
            } else {
                setIsDialogOpen(false);
                reset();
                refreshMachineTypes();
            }
        } catch (error: any) {
            setError(error.message);
        }
    }
    return (
        <CommonDialog
            title="Add Machine Type"
            description="Enter Machine Type Name. Click save when done."
            triggerText="Add Machine Type"
            fields={[
                {
                    name: "machineTypeName",
                    control,
                    label: "Machine Type",
                    type: "text",
                    placeholder: "Enter machine type name",
                    rules: { required: "Machine type name is required", minLength: { value: 2, message: "At least 2 characters required" } },
                },
            ]}
            onSubmit={handleSubmit(onSubmitMachineType)}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
        />
    )
}

export default MachineTypeForm;