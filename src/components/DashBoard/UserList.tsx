import { useEffect, useState } from "react"
import { getAllUsers } from "@/services/UserService"
import { UserData } from "@/types/user.type";
import { DataTable } from "../Datatable/data-table";
import { columns } from "../Datatable/user-columns";
import { DataTableSkeleton } from "../Datatable/data-table-skeleton";
import UserDetail from "./UserDetail";


function Users() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedUSer, setSelectedUser] = useState<UserData | null>(null);

  const handleUserDetail = (user: UserData) => {
          setSelectedUser(user);
      };

  const fetchUsers = async () => {
    setError("");
    try {
      const response = await getAllUsers();

      if (!response || response.statusCode !== 200) {
        setError('Fetch Data Error.')
      }

      setUsers(response.data || []);

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [])

  if (loading) {
    return (
      <div className="py-4 px-2 w-full">
        <h1 className="pb-2 text-3xl font-medium border-b mb-4">Users</h1>
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

  if (error) {
    return <div>Error : {error}</div>
  }

  return (
    <div className="py-4 px-2 w-full">
      <h1 className="pb-2 text-3xl font-medium border-b mb-4">Users</h1>
      <DataTable columns={columns(handleUserDetail)} data={users} searchKey="user" />
      <UserDetail user={selectedUSer} onClose={() => setSelectedUser(null)} />
    </div>
  )
}

export default Users;

