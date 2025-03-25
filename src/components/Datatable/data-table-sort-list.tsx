import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { ArrowUpDown, Trash2 } from "lucide-react";
import { ExtendedSortingState } from "@/utils/types/common.types";
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table } from "@tanstack/react-table";

interface DataTableSortListProps<T> {
  table: Table<T>;
  debounceMs?: number;
}

export function DataTableSortList<T>({
  table,
  debounceMs = 500,
}: DataTableSortListProps<T>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sorting, setSorting] = React.useState<ExtendedSortingState<T>>(() => {
    const parsed = searchParams.get("sort");
    return parsed ? JSON.parse(parsed) : table.initialState.sorting ?? [];
  });

  // Debounce sorting updates
  const debouncedSetSorting = React.useCallback(
    (newSorting: ExtendedSortingState<T>) => {
      const parsed = JSON.stringify(newSorting);
      setSearchParams((prev) => {
        const current = new URLSearchParams(prev);
        current.set("sort", parsed);
        return current;
      });
      setSorting(newSorting);
    },
    [setSearchParams]
  );

  // Add a new sort criteria
  const addSort = () => {
    const availableColumns = table
      .getAllColumns()
      .filter((col) => col.getCanSort() && !sorting.some((s) => s.id === col.id));

    if (availableColumns.length > 0) {
      debouncedSetSorting([
        ...sorting,
        { id: availableColumns[0].id as Extract<keyof T, string>, desc: false },
      ]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button onClick={addSort} variant="outline">
          Add Sort
        </Button>
        <Button
          variant="destructive"
          onClick={() => debouncedSetSorting([])}
        >
          Reset Sorting
        </Button>
      </div>

      {sorting.map((sort, index) => (
        <div key={`${sort.id}-${index}`} className="flex items-center gap-2">
          <Select
            value={sort.id}
            onValueChange={(columnId) =>
              debouncedSetSorting(
                sorting.map((s, i) =>
                  i === index ? { ...s, id: columnId as Extract<keyof T, string> } : s
                )
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select column" />
            </SelectTrigger>
            <SelectContent>
              {table
                .getAllColumns()
                .filter((col) => col.getCanSort())
                .map((column) => (
                  <SelectItem key={column.id} value={column.id}>
                    {column.id}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select
            value={sort.desc ? "desc" : "asc"}
            onValueChange={(direction) =>
              debouncedSetSorting(
                sorting.map((s, i) =>
                  i === index ? { ...s, desc: direction === "desc" } : s
                )
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            onClick={() =>
              debouncedSetSorting(sorting.filter((_, i) => i !== index))
            }
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}