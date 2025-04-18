import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableViewOptions } from "./data-table-view-options";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  searchKey?: string;
  defaultVisibilityOverrides?: Record<string, boolean>;
  renderSubComponent?: (props: { row: any }) => React.ReactElement;
  getRowCanExpand?: (row: any) => boolean;
}

export function DataTable<TData>({
  columns,
  data,
  searchKey,
  defaultVisibilityOverrides = {},
  renderSubComponent,
  getRowCanExpand,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const defaultVisibility = React.useMemo(() => {
    const visibility: Record<string, boolean> = {};
    columns.forEach((col) => {
      const id = col.id;
      if (id) {
        visibility[id] = id.includes(".") ? false : true;
      }
    });
    return { ...visibility, ...defaultVisibilityOverrides };
  }, [columns, defaultVisibilityOverrides]);

  const [columnVisibility, setColumnVisibility] = React.useState(defaultVisibility);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    getRowCanExpand,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      expanded,
    },
  });

  return (
    <div className="space-y-4">
      {searchKey && (
        <div className="flex items-center justify-between flex-col lg:flex-row">
          <Input
            placeholder={`Search by ${searchKey}...`}
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm border border-gray-300"
          />
          <DataTableViewOptions table={table} />
        </div>
      )}
      <div className="rounded-md border border-gray-300 shadow-lg">
        <Table>
          <TableHeader className="bg-gray-300">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {renderSubComponent && (
                  <TableHead className="text-black w-[30px]"></TableHead>
                )}
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-black">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow data-state={row.getIsSelected() && "selected"}>
                    {renderSubComponent && (
                      <TableCell className="p-0 w-[30px] bg-neutral-200">
                        {row.getCanExpand() && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={row.getToggleExpandedHandler()}
                          >
                            {row.getIsExpanded() ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </TableCell>
                    )}
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && renderSubComponent && (
                    <TableRow>
                      <TableCell
                        colSpan={row.getVisibleCells().length + 1}
                        className="p-4"
                      >
                        {renderSubComponent({ row })}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (renderSubComponent ? 1 : 0)}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
