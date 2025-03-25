"use client"

import { MachineTypeData } from "@/types/production.type"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./data-table-column-header"

export const columns: ColumnDef<MachineTypeData>[] = [
    {
        accessorKey: "srno",
        header: "Sr. No.",
        cell: ({ row }) => <div>{row.index + 1}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "machineTypeName",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader className="" column={column} title="Machine Type" />
            )
        },
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
]