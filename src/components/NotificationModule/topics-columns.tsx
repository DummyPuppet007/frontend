import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { DataTableColumnHeader } from "../Datatable/data-table-column-header";
import { Topic } from "@/services/NotificationService";

export const columns: ColumnDef<Topic>[] = [
  {
    id: "srno",
    header: "Sr. No.",
    cell: ({ row }) => <div>{row.index + 1}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Topic Name",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const data = row.original;
      const createdAt = new Date(data.createdAt);
      const formatter = new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      return formatter.format(createdAt);
    },
  },
  {
    accessorKey: "subscriberCount",
    header: "Subscribers",
    cell: ({ row }) => {
      const data = row.original;
      return data.subscriptions?.length || 0;
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    id: "actions",
    cell: ({ row }) => {
      const navigate = useNavigate();
      const topic = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigate("/dashboard/edittopic", { state: { topic } })
              }
            >
              Edit Topic
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate(`/dashboard/topicdetail/${topic.topicId}`)}
            >
              Topic Detail
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
