import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { ProductionDetailsModal } from "./ProductionDetailsModal";
import { getProductionDetailsByProductionId } from "@/services/ProductionService";
import toast from "react-hot-toast";
import { Production, ProductionList } from "@/utils/types/production.types";
import { DataTableColumnHeader } from "../Datatable/data-table-column-header";

export const columns = ({ onUpdate }: { onUpdate: () => void }) => {
  const baseColumns: ColumnDef<ProductionList>[] = [
    {
      id: "srno",
      header: "Sr. No.",
      cell: ({ row }) => <div>{row.index + 1}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "productionOrderCode",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Production Order Code" />
      ),
    },
    {
      accessorKey: "salesOrderDetails.machineModel.machineModelName",
      id: "machineModel",
      header: "Machine Model",
    },
    {
      accessorKey: "salesOrderDetails.machineType.machineTypeName",
      id: "machineType",
      header: "Machine Type",
    },
    {
      accessorKey: "salesOrderDetails.powerRating.powerRating",
      id: "powerRating",
      header: "Power Rating",
    },
    {
      accessorKey: "salesOrderDetails.make.makeName",
      id: "make",
      header: "Make",
    },
    {
      accessorKey: "currentProgress",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Progress" />
      ),
      cell: ({ row }) => (
        <span className="font-bold">{row.getValue("currentProgress")}%</span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ row }) => {
        const data = row.original;
        const createdAt = new Date(data.createdAt as string);
        const formatter = new Intl.DateTimeFormat("en-US", {
          day: "2-digit", // Two-digit day
          month: "long", // Full month name
          year: "numeric", // Four-digit year
        });

        return formatter.format(createdAt);
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      id: "actions",
      cell: ({ row }) => {
        const production = row.original;
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [productionDetails, setProductionDetails] = useState<Production | null>(null);

        const handleViewDetails = async () => {
          try {
            const response = await getProductionDetailsByProductionId(production.productionId);
            if (response.success && response.data !== null) {
              setProductionDetails(response.data);
              setIsModalOpen(true);
            } else {
              toast.error(response.message || "Failed to fetch production details");
            }
          } catch (error) {
            toast.error("Error fetching production details");
          }
        };

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={handleViewDetails}>
                  Production Order Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {productionDetails && (
              <ProductionDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                productionData={productionDetails}
                onUpdate={onUpdate}
              />
            )}
          </>
        );
      },
    },
  ];

  return baseColumns;
};
