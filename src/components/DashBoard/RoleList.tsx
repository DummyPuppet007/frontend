import { useEffect, useState } from "react"
import { getRoles } from "@/services/RoleService"
import { RoleList } from "@/types/role.type";
import { DataTable } from "../Datatable/data-table";
import { columns } from "../Datatable/role-columns";
import RoleForm from "../Form/RoleForm";
import { DataTableSkeleton } from "../Datatable/data-table-skeleton";
import ErrorMessage from "../common/ErrorMessage";

function Role() {
  const [roles, setRoles] = useState<RoleList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchRoles();
  }, [])

  const fetchRoles = async () => {
    try {
      const response = await getRoles();

      if (!response || response.statusCode !== 200) {
        setError("Error : Failed to fetch Roles." + response.message);
      }

      setRoles(response.data || []);
    } catch (error: any) {
      setError("Error : " + error.message);
    } finally {
      setLoading(false);
    }
  }

  if(error) {
    return(
      <div className="m-8">
        <ErrorMessage message={error} className="mb-8"/>
        <DataTableSkeleton
          columnCount={columns.length}
          rowCount={10}
          searchableColumnCount={1}
          showViewOptions={true}
          withPagination={true}
          shrinkZero={false}
        />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col m-8">
        <h1 className="text-3xl font-bold border-b mb-4">Roles</h1>
        <DataTableSkeleton
          columnCount={columns.length}
          rowCount={10}
          searchableColumnCount={1}
          showViewOptions={true}
          withPagination={true}
          shrinkZero={false}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col m-8">
      <h1 className="text-3xl font-bold border-b mb-4">Roles</h1>
      <div className="flex flex-col items-end mb-4">
        <RoleForm refreshRoles={fetchRoles} />
      </div>
      <DataTable columns={columns} data={roles} searchKey="role" />
    </div>
  )
}

export default Role;