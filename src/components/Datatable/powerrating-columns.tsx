"use client"

import { ColumnDef } from "@tanstack/react-table"
import { PowerRatingData } from "@/types/production.type"
import { DataTableColumnHeader } from "./data-table-column-header"

export const columns: ColumnDef<PowerRatingData>[] = [
    {
        accessorKey: "srno",
        header: "Sr. No.",
        cell: ({ row }) => <div>{row.index + 1}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "powerRating",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Power Rating" />
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