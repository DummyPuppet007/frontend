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
import { Link } from "react-router-dom";
import { SalesOrderList } from "@/utils/types/sales.types";
import { Badge } from "../ui/badge";
import { DataTableColumnHeader } from "../Datatable/data-table-column-header";

const statusColors: Record<string, string> = {
  Processing: "bg-blue-500 text-white",
  OPEN: "bg-green-700 text-white",
  CANCELLED: "bg-red-700 text-white",
};

export const columns: ColumnDef<SalesOrderList>[] = [
  {
    id: "srno",
    header: "Sr. No.",
    cell: ({ row }) => <div>{row.index + 1}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "salesOrderCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SalesOrder Code" />
    ),
  },
  {
    accessorKey: "customer.customerName",
    header: "Customer Name",
  },
  {
    accessorKey: "soReceivedDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SO Received Date" />
    ),
    cell: ({ row }) => {
      const data = row.original;
      const soReceivedDate = new Date(data.soReceivedDate as string);
      const formatter = new Intl.DateTimeFormat("en-US", {
        day: "2-digit", // Two-digit day
        month: "long", // Full month name
        year: "numeric", // Four-digit year
      });

      return formatter.format(soReceivedDate);
    },
  },
  {
    accessorKey: "orderStatus",
    header: "Order Status",
    cell: ({ row }) => {
      const status = row.original.orderStatus;
      return (
        <Badge
          className={`px-3 py-1 rounded-lg pointer-events-none ${
            statusColors[status] || "bg-gray-500 text-white"
          }`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    id: "actions",
    cell: ({ row }) => {
      const sales = row.original;
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
            <Link to={`details/${sales.salesOrderId}`}>
              <DropdownMenuItem>Sales Order Details</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
