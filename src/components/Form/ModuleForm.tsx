import CommonDialog from "@/components/common/Dialog"
import { addModule, editModule } from "@/services/ModuleService"
import { ModuleList } from "@/types/module.type";
import { useState, useEffect } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { toast } from "react-hot-toast"

type ModuleFormProps = {
    editData: ModuleList | null;
    setEditData: (data: ModuleList | null) => void;
    refreshModules: () => void;
};

const ModuleForm: React.FC<ModuleFormProps> = ({ editData, setEditData, refreshModules }) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(!!editData);
    const { handleSubmit, reset, setValue, control } = useForm<ModuleList>({
        defaultValues: {
            moduleName: "",
            description: ""
        }
    });

    useEffect(() => {
        if (editData) {
            setValue("moduleName", editData.moduleName);
            setValue("description", editData.description);
            setIsDialogOpen(true);
        } else {
            reset();
        }
    }, [editData, setValue]);

    const onSubmitModule: SubmitHandler<ModuleList> = async (data) => {
        try {
            let response;
            if (editData) {
                const updatedData = {
                    ...data,
                    moduleId: editData.moduleId,
                };
                
                response = await editModule(updatedData);

                if (!response || response.statusCode !== 200) {
                    toast.error("Error : " + response.message);
                    return;
                }
            } else {
                response = await addModule(data);

                if (!response || response.statusCode  !== 200) {
                    toast.error("Error : " + response.message);
                    return;
                }
            }
            toast.success(response.message);
            reset();
            setEditData(null);
            setIsDialogOpen(false);
            refreshModules();
        } catch (error: any) {
            toast.error("Error : " + error.message);
        }
    };

    return (
        <CommonDialog
            title={editData ? "Update Module" : "Create Module"}
            description="Enter Module Name and Description. Click save when done."
            triggerText="Create Module"
            fields={[
                {
                    name: "moduleName",
                    control,
                    label: "Module Name",
                    type: "text",
                    placeholder: "Enter module name",
                    rules: { required: "Module name is required", minLength: { value: 2, message: "At least 2 characters required" } },
                },
                {
                    name: "description",
                    control,
                    label: "Description",
                    type: "text",
                    placeholder: "Enter description",
                    rules: { required: "Description is required" },
                },
            ]}
            onSubmit={handleSubmit(onSubmitModule)}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
        />
    );
}

export default ModuleForm;