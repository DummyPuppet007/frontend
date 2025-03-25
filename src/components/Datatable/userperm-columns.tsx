"use client"

import { UserPermissionList } from "@/types/userpermission.type"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./data-table-column-header"

export const columns: ColumnDef<UserPermissionList>[] = [
    {
        id: "srno",
        header: "Sr. No.",
        cell: ({ row }) => <div>{row.index + 1}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "username",
        header: "User Name",
        cell: ({row}) => {
            const data =row.original;
            const fullname = `${data.user.firstname} ${data.user.lastname}`
            return fullname;
        }
    },
    {
        accessorKey: "permission",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Permission Name"/>
            )
        },
        cell: ({row}) => {
            const data = row.original;
            const permissionName = `${data.permission.module.moduleName} - ${data.permission.action.actionName}`;
            return permissionName;
        }
    },
    {
            accessorKey: "createdAt",
            header: ({column}) => (
                <DataTableColumnHeader column={column} title="Create Date"/>
            ),
            cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric"
            }),
        }
]