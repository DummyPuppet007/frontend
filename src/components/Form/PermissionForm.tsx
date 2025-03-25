import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { getModules } from "@/services/ModuleService";
import { getActions } from "@/services/ActionService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { addPermission, editPermission } from "@/services/PermissionService";
import { useNavigate } from "react-router-dom";
import { ModuleList } from "@/types/module.type";
import { ActionList } from "@/types/action.type";
import { PermissionData } from "@/types/permission.type";
import { motion } from "framer-motion";

interface PermissionFormProps {
    initialData?: PermissionData;
}

const PermissionForm: React.FC<PermissionFormProps> = ({ initialData }) => {
    const {
        control,
        handleSubmit,
        setValue, 
        formState: { errors },
    } = useForm<PermissionData>({
    });

    const [moduleData, setModuleData] = useState<ModuleList[] | null>([]);
    const [actionData, setActionData] = useState<ActionList[] | null>([]);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [modules, actions] = await Promise.all([
                    getModules(), 
                    getActions()
                ]);

                setModuleData(modules.data);
                setActionData(actions.data);
            } catch (error: any) {
                console.error(error.message);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {   
        if (initialData) {
            setValue("moduleId", initialData.moduleId);
            setValue("actionId", initialData.actionId);
        }
    }, [initialData, setValue]);

    const onSubmitPermissionForm = async (data: PermissionData) => { 
        setError("");
        try {
           
            if (initialData) {
                const response = await editPermission(initialData.permissionId!, data) 

                if (!response || response.statusCode !== 200) {
                    setError("Failed To Update Permission.");
                    return;
                }

                navigate("/dashboard/auth/permissions");
            } else {   
                const response = await addPermission(data); 

                if (!response || response.statusCode !== 200) {
                    setError("Failed To Create Permission.");
                    return;
                }

                navigate("/dashboard/auth/permissions");
            }      
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <>
            <h1 className="pb-2 text-3xl font-medium border-b mb-4">{initialData ? "Edit Permission" : "Create Permission"}</h1>
            <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="my-5 py-5 border border-neutral-400 rounded-lg shadow-lg">
                <form onSubmit={handleSubmit(onSubmitPermissionForm)} className="space-y-6 m-4">
                    <div>
                        <Label htmlFor="moduleId" className="block text-md font-medium text-zinc-900">Select Module:</Label>
                        {moduleData && moduleData.length > 0 ? (
                            <Controller
                                name="moduleId"
                                control={control}
                                rules={{ required: "Module selection is required" }}
                                render={({ field }) => (
                                    <Select onValueChange={(value) => (field.onChange(Number(value)))}
                                    value={field.value ? field.value.toString() : ""}>
                                        <SelectTrigger className="mt-1 w-[45%] px-3 py-2 border rounded-md shadow-sm bg-white">
                                            <SelectValue placeholder="Select a module" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-200">
                                            {moduleData.map((module) => (
                                                <SelectItem key={module.moduleId} value={String(module.moduleId)}>{module.moduleName}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        ) : (
                            <p className="text-gray-500">No modules available.</p>
                        )}
                        {errors.moduleId && <p className="text-red-500 text-sm mt-1 font-medium">{errors.moduleId.message}</p>}

                        <div className="mt-5">
                            <Label className="block text-md font-medium text-zinc-900">Select Action:</Label>
                            {actionData && actionData.length > 0 ? (
                                <Controller
                                    name="actionId"
                                    control={control}
                                    rules={{ required: "Action selection is required" }}
                                    render={({ field }) => (
                                        <RadioGroup onValueChange={(value) => (field.onChange(Number(value)))} 
                                        value={field.value ? field.value.toString() : ""}>
                                            {actionData.map((action) => (
                                                <div key={action.actionId} className="flex items-center space-x-2 mt-2">
                                                    <RadioGroupItem value={String(action.actionId)} />
                                                    <label htmlFor={`action-${action.actionId}`} className="text-sm text-zinc-700 font-medium">
                                                        {action.actionName}
                                                    </label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    )}
                                />
                            ) : (
                                <p className="text-gray-500">No actions available.</p>
                            )}
                            {errors.actionId && <p className="text-red-500 text-sm mt-1 font-medium">{errors.actionId.message}</p>}
                        </div>

                        <Button type="submit" className="mt-5 w-[45%] bg-zinc-900 hover:bg-zinc-700">
                            {initialData ? "Update Permission" : "Create Permission"}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </>
    );
};

export default PermissionForm;
