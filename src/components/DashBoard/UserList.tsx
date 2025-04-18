import { useEffect, useState } from "react"
import { getAllUsers } from "@/services/UserService"
import { UserData } from "@/types/user.type";
import { DataTable } from "../Datatable/data-table";
import { columns } from "../Datatable/user-columns";
import { DataTableSkeleton } from "../Datatable/data-table-skeleton";
import UserDetail from "./UserDetail";
import ErrorMessage from "../common/ErrorMessage";


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
        setError("Error : Failed to fetch Users." + response.message);
      }
      setUsers(response.data || []);
    } catch (error: any) {
      setError("Error : " + error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [])

  if(error) {
    return(
      <div className="m-8">
        <ErrorMessage message={error} className="mb-8"/>
        <DataTableSkeleton
          columnCount={7}
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
        <h1 className="text-3xl font-bold border-b mb-4">Users</h1>
        <DataTableSkeleton
          columnCount={7}
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
      <h1 className="text-3xl font-bold border-b mb-4">Users</h1>
      <DataTable columns={columns(handleUserDetail)} data={users} searchKey="user" />
      <UserDetail user={selectedUSer} onClose={() => setSelectedUser(null)} />
    </div>
  )
}

export default Users;

