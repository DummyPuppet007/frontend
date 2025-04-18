import CommonDialog from "@/components/common/Dialog"
import { createMachineType } from "@/services/ProductionService";
import { MachineTypeData } from "@/types/production.type";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

type MachineTypeFormProps = {
    refreshMachineTypes : () => void;
}

const MachineTypeForm: React.FC<MachineTypeFormProps> = ({refreshMachineTypes}) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const { handleSubmit, control, reset } = useForm<MachineTypeData>({
        defaultValues: {
            machineTypeName : "",
        }
    });

    const onSubmitMachineType: SubmitHandler<MachineTypeData> = async (data) => {
        try {
            const response = await createMachineType(data);

            if(!response || response.statusCode !== 200){
                toast.error("Failed to create Machine Type : " + response.message);
                return;
            } else {
                toast.success(response.message);
                setIsDialogOpen(false);
                reset();
                refreshMachineTypes();
            }
        } catch (error: any) {
            toast.error("Error : " + error.message);
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