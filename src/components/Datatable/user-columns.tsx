"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"
import { UserData } from "@/types/user.type"
import { DataTableColumnHeader } from "./data-table-column-header"


export const columns = (onDetailClick: (user: UserData) => void): ColumnDef<UserData>[] => [
    {
        id: "srno",
        header: "Sr. No.",
        cell: ({ row }) => <div>{row.index + 1}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: "Name",
        cell : ({row}) => {
            const data =row.original;
            const fullName = `${data.firstname} ${data.lastname}`
            return fullName;
        }
    },
    {
        accessorKey: "username",
        header: "Login Id",
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Email" />
            )
        },
    },
    {
        accessorKey: "roleName",
        header: "Role Name",
        cell: ({row}) => (row.original.role.roleName)
    },
    {
        accessorKey: "createdAt",
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
        cell: ( {row} ) => {   
            const navigate = useNavigate(); 
            const user= row.original;
            
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
                        <DropdownMenuItem onClick={() => navigate(`/dashboard/auth/edit-user/${user.userId}`)}>Edit User</DropdownMenuItem> 
                        <DropdownMenuItem onClick={() => onDetailClick(user)}>User Detail</DropdownMenuItem>
                        <DropdownMenuItem>Lock User</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }
]