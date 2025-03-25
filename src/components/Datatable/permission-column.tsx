"use client"

import { ColumnDef } from "@tanstack/react-table"
import { PermissionList } from "@/types/permission.type"
import { DataTableColumnHeader } from "./data-table-column-header"

export const columns : ColumnDef<PermissionList>[] = [
    {
        id: "srno",
        header: "Sr. No.",
        cell: ({ row }) => <div>{row.index + 1}</div>,
        enableSorting: false,
        enableHiding: false,
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
            const permissionName = `${data.module.moduleName} - ${data.action.actionName}`;
            return permissionName;
        }
    },
    {
        accessorKey: "moduleName",
        header: "Module",
        cell: ({ row }) => (row.original.module.moduleName)
    },
    {
        accessorKey: "actionName",
        header: "Action",
        cell: ({ row }) => (row.original.action.actionName)
    },
    {
        accessorKey: "createdAt",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Create Date"/>
        ),
        cell : ({row}) => {
            const data =row.original;
            const createdAt = new Date(data.createdAt as string);
            const formatter = new Intl.DateTimeFormat("en-US", {
                day: "2-digit", 
                month: "long", 
                year: "numeric" 
              });
            
            return formatter.format(createdAt);;
        }

    },
]
