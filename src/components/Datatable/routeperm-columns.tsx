"use client"

import { RoutePermissionList } from "@/types/routepermission.type"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./data-table-column-header"

export const columns: ColumnDef<RoutePermissionList>[] = [
    {
        id: "srno",
        header: "Sr. No.",
        cell: ({ row }) => <div>{row.index + 1}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "route",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Route Name" />
            )
        },
        cell: ({row}) => {
            const data = row.original;
            const routename = data.route.routeName;
            return routename;
        }
    },
    {
        accessorKey: "Method",
        header: "Method",
        cell: ({row}) => {
            const data = row.original;
            const methodname = data.route.httpMethod;
            return methodname;
        }
    },
    {
        accessorKey: "permission",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Permission Name" />
            )
        },
        cell: ({ row }) => {
            const data = row.original;
            const permissionName = `${data.permission.module.moduleName} - ${data.permission.action.actionName}`;
            return permissionName;
        }
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Create Date" />
        ),
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric"
        }),
    }
]