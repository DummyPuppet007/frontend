import { useEffect, useState } from "react";
import { columns } from "./topics-columns";
import { DataTable } from "../Datatable/data-table";
import { DataTableSkeleton } from "../Datatable/data-table-skeleton";
import { DateRangePicker } from "../common/DateRangePicker";
import {
  createNewTopic,
  getAllNotificationTopics,
  Topic,
} from "@/services/NotificationService";
import { DynamicDialog } from "../common/DynamicDialog";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import ErrorMessage from "../common/ErrorMessage";
import { DateRange } from "react-day-picker";

const SubscribersTable = ({ subscriptions }: { subscriptions: Topic['subscriptions'] }) => {
  const subscriberColumns = [
    {
      id: "srno",
      header: "Sr. No.",
      cell: ({ row }: any) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "user.firstname",
      id: "firstname",
      header: "Name",
      cell: ({ row }: any) => {
        const user = row.original.user;
        return `${user.firstname} ${user.lastname}`;
      }
    },
    {
      accessorKey: "user.username",
      id: "username",
      header: "Username",
      cell: ({ row }: any) => row.original.user.username
    },
    {
      accessorKey: "user.role.roleName",
      id: "role",
      header: "Role",
      cell: ({ row }: any) => row.original.user.role.roleName
    }
  ];

  return (
    <div className="bg-white p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Subscribed Users</h3>
      <DataTable
        columns={subscriberColumns}
        data={subscriptions}
        searchKey="User"
      />
    </div>
  );
};

function TopicsList() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [error, setError] = useState<string>("");
  const [toastShown, setToastShown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({ 
    from: undefined,
    to: undefined 
  });

  const fetchTopics = async (fromDate?: Date, toDate?: Date) => {
    try {
      const response = await getAllNotificationTopics(fromDate, toDate);
      if (!response || response.statusCode !== 200) {
        setError(response.message);
        return;
      }
      setTopics(response.data || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setToastShown(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics(dateRange?.from, dateRange?.to);
  }, [toastShown, dateRange]);

  const handleCreateTopic = async (formData: any) => {
    try {
      setError("");
      const response = await createNewTopic(formData.name, formData.description);

      if (response.success && response.statusCode < 300) {
        toast.success(response.message);
        fetchTopics(dateRange?.from, dateRange?.to);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      console.error("Error creating topic:", error);
    }
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
  };

  if (error) {
    return (
      <>
        <ErrorMessage message={error} className="m-8" />
        <DataTableSkeleton
          columnCount={6}
          searchableColumnCount={1}
          filterableColumnCount={2}
          cellWidths={["2rem", "2rem", "2rem", "2rem", "2rem", "2rem"]}
          shrinkZero
          className="w-[95%] m-auto"
        />
      </>
    );
  }

  if (isLoading) {
    return (
      <DataTableSkeleton
        columnCount={6}
        searchableColumnCount={1}
        filterableColumnCount={2}
        cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem", "8rem"]}
        shrinkZero
        className="w-[95%] m-auto"
      />
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Topics</h2>
        <div className="flex gap-4 items-center">
          <DateRangePicker
            placeholder="Select date range"
            onDateRangeChange={handleDateRangeChange}
            defaultDateRange={dateRange}
          />
          <DynamicDialog
            title="Create New Topic"
            trigger={
              <Button variant="default" size="sm">
                Create New Topic
              </Button>
            }
            fields={[
              {
                name: "name",
                label: "Topic Name",
                type: "text",
                placeholder: "Enter topic name",
                required: true,
              },
              {
                name: "description",
                label: "Description",
                type: "textarea",
                placeholder: "Enter topic description",
                required: true,
              },
            ]}
            onSubmit={handleCreateTopic}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={topics}
        searchKey="name"
        renderSubComponent={({ row }) => (
          <SubscribersTable subscriptions={row.original.subscriptions || []} />
        )}
        getRowCanExpand={(row) => (row.original.subscriptions?.length || 0) > 0}
      />
    </div>
  );
}

export default TopicsList;
