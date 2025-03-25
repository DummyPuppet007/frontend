"use client"

import { ColumnDef } from "@tanstack/react-table"
import { RolePermissionList } from "@/types/rolepermission.type";
import { DataTableColumnHeader } from "./data-table-column-header";

export const columns: ColumnDef<RolePermissionList>[] = [
    {
        id: "srno",
        header: "Sr. No.",
        cell: ({ row }) => <div>{row.index + 1}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "role",
        header: "Role Name",
        cell: ({row}) => (row.original.role.roleName)
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
];