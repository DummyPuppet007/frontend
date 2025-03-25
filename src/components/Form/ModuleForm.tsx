import CommonDialog from "@/Common/Dialog"
import { addModule, editModule } from "@/services/ModuleService"
import { ModuleList } from "@/types/module.type";
import { useState, useEffect } from "react"
import { useForm, SubmitHandler } from "react-hook-form"

type ModuleFormProps = {
    editData: ModuleList | null;
    setEditData: (data: ModuleList | null) => void;
    refreshModules: () => void;
};

const ModuleForm: React.FC<ModuleFormProps> = ({ editData, setEditData, refreshModules }) => {
    const [error, setError] = useState<string>("");
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
        setError("")
        try {
            if (editData) {
                const response = await editModule(editData.moduleId, data);

                if (!response || response.statusCode !== 200) {
                    setError("Failed To Update Module.");
                }
            } else {
                const response = await addModule(data);

                if (!response || response.statusCode !== 200) {
                    setError("Failed TO Create Module.");
                }
            }
            reset();
            setEditData(null);
            setIsDialogOpen(false);
            refreshModules();
        } catch (error: any) {
            setError(error.message);
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