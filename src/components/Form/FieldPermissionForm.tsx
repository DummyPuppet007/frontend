const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useCallback, useEffect, useState } from "react";
import { getRoles } from "@/services/RoleService";
import { getAllUsers } from "@/services/UserService";
import { RoleList } from "@/types/role.type";
import { UserData } from "@/types/user.type";
import ErrorMessage from "../common/ErrorMessage";
import { Button } from "../ui/button";
import { DropdownSearch } from "../common/DropdownSearch";
import { debounce } from "lodash";
import axios from "axios";
import { MultiSelect } from "../common/multi-select";
import { useNavigate } from "react-router-dom";
import { FieldPermissionData, searchTableRes } from "@/types/fieldpermission.type";
import { addFieldPermission } from "@/services/FieldPermissionService";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FieldPermissionSkeleton } from "../common/Skeletons";

const FieldPermissionForm: React.FC = () => {
  const { handleSubmit, control, formState: { errors }, } = useForm<FieldPermissionData>();
  const [roles, setRoles] = useState<RoleList[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [searchResults, setSearchResults] = useState<searchTableRes[]>([]);
  const [columns, setColumns] = useState<{ label: string; value: string }[]>([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [userData, roleData] = await Promise.all([
        getAllUsers(),
        getRoles()
      ])

      if (!userData || userData.statusCode !== 200) {
        setError("Error : Failed to fetch Users." + userData.message);
        return;
      } else if (!roleData || roleData.statusCode !== 200) {
        setError("Error : Failed to fetch Roles." + roleData.message);
        return;
      }

      setRoles(roleData.data || []);
      setUsers(userData.data || []);
    } catch (error: any) {
      setError("Error : " + error.message);
    }
  }


  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchChange = useCallback(
    debounce(async (value: string, type: string) => {
      if (value.length >= 2) {
        const response = await axios.get(
          `${API_BASE_URL}auth/${type}/search?name=${value}`,
          { withCredentials: true }
        );

        if (!response || response.status !== 200) {
          setError("Error : Failed to fetch tables." + response.data.message);
        }
        if (type === "table") {
          setSearchResults(
            response.data.data.map((table: any) => ({
              id: table.id,
              name: table.name,
              columns: table.columns
            }))
          );
        }
      } else {
        setSearchResults([]);
      }
    }, 300),
    []
  );

  const handleTableSelect = (field: any, result: any) => {
    field.onChange(result.name);

    const selectedTable = searchResults.find((table) => table.name === result.name);

    if (selectedTable) {
      setColumns(
        selectedTable.columns.map((column: string) => ({
          label: column.replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())
            .trim(),
          value: column,
        }))
      );
    }
  }

  const onSubmitFieldPermission: SubmitHandler<FieldPermissionData> = async (data) => {
    try {
      const response = await addFieldPermission(data);

      if (!response || response.statusCode !== 200) {
        toast.error("Error : " + response.message);
        return;
      }

      toast.success(response.message);
      navigate("/dashboard/auth/field-permissions");
    } catch (error: any) {
      toast.error("Error : " + error.message);
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return (
      <div>
        <ErrorMessage message={error} className="mb-8" />
        <FieldPermissionSkeleton />
      </div>
    )
  }
  return (
    <>
      <h1 className="text-3xl font-bold border-b mb-4">Create Field Permission</h1>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <form onSubmit={handleSubmit(onSubmitFieldPermission)}>

          <div className="w-full sm:w-[50%]">
            <Label htmlFor="userId" className="block text-sm font-medium text-zinc-900">
              Select User
            </Label>

            {users && users.length > 0 ? (
              <Controller
                name="userId"
                control={control}
                rules={{ required: "User selection is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? field.value.toString() : ""}
                  >
                    <SelectTrigger className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.userId} value={user.userId.toString()}>
                          {user.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            ) : (
              <p className="text-gray-500">No users available.</p>
            )}

            {errors.userId && <p className="text-red-500 text-sm mt-1 font-medium">{errors.userId.message}</p>}
          </div>
          <div className="w-full sm:w-[50%] mt-4">
            <Label htmlFor="roleId" className="block text-sm font-medium text-zinc-900">
              Select Role
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

          <div className="w-full sm:w-[50%] mt-4">
            <Label htmlFor="resource" className="block text-sm font-medium text-zinc-900">
              Select Table
            </Label>
            <Controller
              name="resource"
              control={control}
              rules={{ required: "Table selection is required" }}
              render={({ field }) => (
                <DropdownSearch
                  placeholder="Search table name"
                  results={searchResults}
                  onChange={(value) => {
                    field.onChange(value);
                    setColumns([]);
                  }}
                  onSearch={(value) => handleSearchChange(value, "table")}
                  onSelect={(result) => handleTableSelect(field, result)}
                  getDisplay={() =>
                    field.value
                      ? searchResults.find((mt) => mt.name === field.value)
                        ?.name || ""
                      : ""
                  }
                />
              )}
            />
            {errors.resource && <p className="text-red-500 text-sm mt-1 font-medium">{errors.resource.message}</p>}
          </div>

          <div className="w-full sm:w-[50%] mt-4">
            <Label>Select Column (multiple selection available)</Label>
            <Controller
              name="allowedFields"
              control={control}
              rules={{ required: "Column selection is required" }}
              render={({ field }) => (
                <MultiSelect
                  options={columns}
                  value={field.value}
                  onValueChange={(values) => {
                    field.onChange(values);
                  }}
                  placeholder="Select table columns"
                  maxCount={6}
                  animation={0.3}
                />
              )}
            />
            {errors.allowedFields && <p className="text-red-500 text-sm mt-1 font-medium">{errors.allowedFields.message}</p>}
          </div>

          <div className="w-full sm:w-[50%] mt-6">
            <Button
              type="submit" disabled={loading}
              className="w-full">
              {loading ? "Submitting..." : "Create Field Permission"}
            </Button>
          </div>
        </form>
      </motion.div>
    </>
  )
}

export default FieldPermissionForm;
