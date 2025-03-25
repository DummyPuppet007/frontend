import { useEffect, useState } from "react"
import { getRoles } from "@/services/RoleService"
import { RoleList } from "@/types/role.type";
import { DataTable } from "../Datatable/data-table";
import { columns } from "../Datatable/role-columns";
import RoleForm from "../Form/RoleForm";
import { DataTableSkeleton } from "../Datatable/data-table-skeleton";

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
        setError('Fetch Data Error.')
      }

      setRoles(response.data || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="py-4 px-2 w-full">
        <h1 className="pb-2 text-3xl font-medium border-b mb-4">Roles</h1>
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
    <div className="py-4 px-2 w-full">
      <h1 className="pb-2 text-3xl font-medium border-b mb-4">Roles</h1>
      <div className="flex flex-col items-end mb-4">
        <RoleForm refreshRoles={fetchRoles} />
      </div>
      <DataTable columns={columns} data={roles} searchKey="role" />
    </div>
  )
}

export default Role;