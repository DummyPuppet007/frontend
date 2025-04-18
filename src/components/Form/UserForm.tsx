import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { getRoles } from "@/services/RoleService";
import { registerUser, editUser } from "@/services/UserService";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Eye, EyeOff } from "lucide-react";
import { RoleList } from "@/types/role.type";
import { Label } from "../ui/label";
import { UserData } from "@/types/user.type";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { toast } from "react-hot-toast";
import ErrorMessage from "../common/ErrorMessage";
import { UserFormSkeleton } from "../common/Skeletons";

interface UserFormProps {
  initialData?: UserData | null;
}

const UserForm: React.FC<UserFormProps> = ({ initialData }) => {
  const navigate = useNavigate();
  const { register,
    handleSubmit,
    formState: { errors },
    reset,
    control } = useForm<UserData>();
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState<RoleList[] | null>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getRoles();

        if (!response || response.statusCode !== 200) {
          setError("Error : Failed to fetch Roles." + response.message);
        } else {
          setRoles(response.data)
        }
      } catch (error: any) {
        setError("Error : " + error.message);
      }
    }

    fetchRoles();
  }, [])

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const createUser: SubmitHandler<UserData> = async (data) => {
   
    const formData: UserData = {
      ...data,
      middleName: data.middleName === "" ? null : data.middleName,
      email: data.email === "" ? null : data.email,
    };
           
    if (initialData) {
      try {
        const editresponse = await editUser(formData);

        if (!editresponse || editresponse.statusCode !== 200) {
          toast.error("Failed to edit user : " + editresponse.message);
          return;
        } else {
          toast.success(editresponse.message);
          navigate("/dashboard/auth/users");
        }
      } catch (error: any) {
        toast.error("Error : " + error.message);
      } finally {
        setLoading(false);
      }
    } else {

      try {
        const response = await registerUser(formData);

        if (!response || response.statusCode !== 200) {
          toast.error("Failed to create user : " + response.message);
          return;
        } else {
          toast.success(response.message);
          navigate("/dashboard/auth/users");
        }
      } catch (error: any) {
        toast.error("Error : " + error.message);
      } finally {
        setLoading(false);
      }
    }
  }

  if (error) {
    return (
      <div>
        <ErrorMessage message={error} />
        <UserFormSkeleton />
      </div>
    )
  }

  return (
    <>
      <h1 className="text-3xl font-bold border-b mb-4">{initialData ? "Edit User" : "Create User"}</h1>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <form onSubmit={handleSubmit(createUser)} className="space-y-6 ">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div>
              <Label htmlFor="firstname" className="block text-sm font-medium text-zinc-900">
                First Name
              </Label>
              <Input
                type="text"
                {...register("firstname", { required: "First name is required", minLength: { value: 2, message: "First name must be at least 2 characters" } })}
                id="firstname"
                autoComplete="off"
                placeholder="Enter First Name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm "
              />
              {errors.firstname && <p className="text-red-500 text-sm mt-1 font-medium">{errors.firstname.message}</p>}
            </div>

            <div>
              <Label htmlFor="middleName" className="block text-sm font-medium text-zinc-900">
                Middle Name
              </Label>
              <Input
                type="text"
                {...register("middleName")}
                id="middleName"
                autoComplete="off"
                placeholder="Enter Middle Name (optional)"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <Label htmlFor="lastname" className="block text-sm font-medium text-zinc-900">
                Last Name
              </Label>
              <Input
                type="text"
                {...register("lastname", { required: "Last name is required", minLength: { value: 2, message: "Last name must be at least 2 characters" } })}
                id="lastname"
                autoComplete="off"
                placeholder="Enter Last Name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              {errors.lastname && <p className="text-red-500 text-sm mt-1 font-medium">{errors.lastname.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-zinc-900">
              Email
            </Label>
            <Input
              type="email"
              {...register("email", { pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: "Invalid email address" } })}
              id="email"
              autoComplete="off"
              placeholder="Enter E-mail ID (optional)"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1 font-medium">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username" className="block text-sm font-medium text-zinc-900">
                Username
              </Label>
              <Input
                type="text"
                {...register("username", { required: "Username is required", minLength: { value: 2, message: "Username must be at least 2 characters" } })}
                id="username"
                autoComplete="off"
                placeholder="Enter Username"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              {errors.username && <p className="text-red-500 text-sm mt-1 font-medium">{errors.username.message}</p>}
            </div>
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-zinc-900">
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: !initialData ? "Password is required" : false,
                    minLength: !initialData ? { value: 6, message: "Password must be at least 6 characters" } : undefined, // Min length only for register
                  })}
                  id="password"
                  disabled={!!initialData}
                  autoComplete="off"
                  placeholder="Enter Password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1 font-medium">{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="roleId" className="block text-sm font-medium text-zinc-900">
              Select Role:
            </Label>

            {roles && roles.length > 0 ? (
              <Controller
                name="roleId"
                control={control}
                rules={{ required: "Role selection is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? field.value.toString() : ""}
                  >
                    <SelectTrigger className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.roleId} value={role.roleId.toString()}>
                          {role.roleName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            ) : (
              <p className="text-gray-500">No roles available.</p>
            )}

            {errors.roleId && <p className="text-red-500 text-sm mt-1 font-medium">{errors.roleId.message}</p>}
          </div>

          <div>
            <Button
              type="submit" disabled={loading}
              className="w-full">
              {loading ? "Submitting..." :
                initialData ? "Edit User" : "Create User"}
            </Button>
          </div>
        </form>
      </motion.div>
    </>
  )
}

export default UserForm;
