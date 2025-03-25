"use client"

import { CustomerData } from "@/types/customer.type"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./data-table-column-header"
import { useNavigate } from "react-router-dom"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { Button } from "../ui/button"



export const columns = (onDetailClick: (customer: CustomerData) => void): ColumnDef<CustomerData>[] => [
    {
        accessorKey: "srno",
        header: "Sr. No.",
        cell: ({ row }) => <div>{row.index + 1}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "customerCode",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Customer Code" />
            )
        },
    },
    {
        accessorKey: "customerName",
        header: "Customer Name",
    },
    {
        accessorKey: "customerType",
        header: "Customer Type"
    },
    {
        accessorKey: "createdate",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Create Date" />
            )
        },
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric"
        }),
    },
    {
        accessorKey: "action",
        header: "Action",
        id: "actions",
        cell: ({ row }) => {
            const navigate = useNavigate();
            const customer = row.original;

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
                        <DropdownMenuItem onClick={() => navigate(`/dashboard/edit-customer/${customer.customerId}`)}>Edit Customer</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDetailClick(customer)}>Customer Detail</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }
]