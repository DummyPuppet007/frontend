import { createRole } from "@/services/RoleService"
import React from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useState } from "react"
import CommonDialog from "@/components/common/Dialog"
import { RoleFormData } from "@/types/role.type"
import { toast } from "react-hot-toast"

type RoleFormProps = {
  refreshRoles: () => void;
};

const RoleForm: React.FC<RoleFormProps> = ({refreshRoles}) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const { handleSubmit, control, reset } = useForm<RoleFormData>({
    defaultValues: {
      roleName: "",
      description: ""
    }
  });

  const onSubmitRole: SubmitHandler<RoleFormData> = async (data) => {
    
    try {
      const response = await createRole(data);
      
      if (!response || response.statusCode !== 200) {
        toast.error("Failed to create Role."+response.message);
      } else {
        toast.success(response.message);
        setIsDialogOpen(false);
        reset();
        refreshRoles();
      }
    } catch (error: any) {
      toast.error("Error : "+error.message);
    }
  };

  return (
    <CommonDialog
      title="Create Role"
      description="Enter Role Name and Description. Click save when done."
      triggerText="Create Role"
      fields={[
        {
          name: "roleName",
          control,
          label: "Role Name",
          type: "text",
          placeholder: "Enter role name",
          rules: { required: "Role name is required", minLength: { value: 2, message: "At least 2 characters required" } },
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
      onSubmit={handleSubmit(onSubmitRole)}
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
    />
  );
};



export default RoleForm;
