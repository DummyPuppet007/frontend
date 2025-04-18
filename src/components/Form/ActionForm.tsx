import { useState, useEffect } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { createAction, updateAction } from "@/services/ActionService"
import { ActionList } from "@/types/action.type"
import CommonDialog from "@/components/common/Dialog"
import toast from "react-hot-toast"

type ActionFormProps = {
    editData: ActionList | null;
    setEditData: (data: ActionList | null) => void;
    refreshActions: () => void;
};

const ActionForm: React.FC<ActionFormProps> = ({ editData, setEditData, refreshActions }) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(!!editData);
    const { handleSubmit, reset, setValue, control } = useForm<ActionList>({
        defaultValues: {
            actionName: "",
            description: ""
        }
    });

    useEffect(() => {
        if (editData) {
            setIsDialogOpen(true);
            setValue("actionName", editData.actionName);
            setValue("description", editData.description);
        } else {
            reset();
        }
    }, [editData, setValue]);

    const onSubmitAction: SubmitHandler<ActionList> = async (data) => {
        try {
            let response;
            if (editData) {
                const updatedData = {
                    ...data,
                    actionId: editData.actionId,
                };
    
                response = await updateAction(updatedData);
                
                if (!response || response?.statusCode !== 200) {
                    toast.error("Error : " + response.message);
                    return;
                }
            }
            else {
                response = await createAction(data);

                if (!response || response?.statusCode !== 200) {
                    toast.error("Error : " + response.message);
                    return;
                }
            }
            toast.success(response.message);
            reset();
            setEditData(null);
            setIsDialogOpen(false);
            refreshActions();
        } catch (error: any) {
            toast.error("Error : " + error.message);
        } 
    };

    return (
        <CommonDialog
            title={editData ? "Update Action" : "Create Action"}
            description="Enter Action Name and Description. Click save when done."
            triggerText="Create Action"
            fields={[
                {
                    name: "actionName",
                    control,
                    label: "Action Name",
                    type: "text",
                    placeholder: "Enter action name",
                    rules: { required: "Action name is required", minLength: { value: 2, message: "At least 2 characters required" } },
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
            onSubmit={handleSubmit(onSubmitAction)}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
        />
    );
}

export default ActionForm;
