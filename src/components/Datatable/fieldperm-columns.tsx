"use client"

import { FieldPermissions } from "@/types/fieldpermission.type"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./data-table-column-header";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";


export const columns: ColumnDef<FieldPermissions>[] = [
    {
        id: "srno",
        header: "Sr. No.",
        cell: ({ row }) => <div>{row.index + 1}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "resource",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Table Name" />
        ),
    },
    {
        accessorKey: "allowedFields",
        header: "Allowed Columns",
        cell: ({ row }) => {

            const allowedFields = Array.isArray(row.original.allowedFields)
                ? row.original.allowedFields
                : row.original.allowedFields?.split(",") || [];

            return (
                <div className="flex flex-wrap gap-1 max-w-[320px]">
                    {allowedFields.length > 5 ? (
                        <>
                            {allowedFields.slice(0, 5).map((field: any, index: number) => (
                                <Badge key={index}
                                    className="bg-blue-100 text-blue-700 border border-blue-300 rounded-full px-2 py-0.5 text-xs font-medium pointer-events-none"
                                >{field}</Badge>
                            ))}
                            <Tooltip>
                                <TooltipTrigger className="cursor-pointer text-blue-500 text-sm">+{allowedFields.length - 3} more</TooltipTrigger>
                                <TooltipContent className="bg-gray-900 text-white p-2 rounded-md">
                                    {allowedFields.slice(3).join(", ")}
                                </TooltipContent>
                            </Tooltip>
                        </>
                    ) : (
                        allowedFields.map((field: any, index: number) => (
                            <Badge key={index}
                                className="bg-blue-100 text-blue-700 border border-blue-300 rounded-full px-2 py-0.5 text-xs font-medium pointer-events-none"
                            >{field}</Badge>
                        ))
                    )}
                </div>
            );
        },
        size: 350,
    },
    {
        accessorKey: "username",
        header: "User Name",
        cell: ({ row }) => {
            const data = row.original;
            const name = data.user.username
            return name;
        }
    },
    {
        accessorKey: "role",
        header: "Role Name",
        cell: ({ row }) => (row.original.role.roleName)
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