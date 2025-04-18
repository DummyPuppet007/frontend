import { useCallback, useEffect, useState } from "react";
import { columns } from "./production-columns";
import { DataTable } from "../Datatable/data-table";
import { DataTableSkeleton } from "../Datatable/data-table-skeleton";
import { DateRangePicker } from "../common/DateRangePicker";
import { ProductionList } from "@/utils/types/production.types";
import { getAllProductionList } from "@/services/ProductionService";
import ErrorMessage from "../common/ErrorMessage";

function ProductionDatatableList() {
  const [production, setProduction] = useState<ProductionList[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });

  const fetchProductionList = useCallback(
    async (fromDate?: Date, toDate?: Date) => {
      try {
        const response = await getAllProductionList(fromDate, toDate);
        if (!response || response.statusCode !== 200) {
          setError(response.message);
          return;
        }
        setProduction(response.data || []);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchProductionList(dateRange.from, dateRange.to);
  }, [dateRange, fetchProductionList]);

  const handleDateRangeChange = (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => {
    setDateRange(range);
  };

  if (error) {
    return (
      <>
        <ErrorMessage message={error} className="m-8" />
        <DataTableSkeleton
          columnCount={6}
          searchableColumnCount={1}
          filterableColumnCount={2}
          cellWidths={["2rem", "2rem", "2rem", "2rem", "2rem", "2rem"]}
          shrinkZero
          className="w-[95%] m-auto"
        />
      </>
    );
  }

  if (isLoading) {
    return (
      <DataTableSkeleton
        columnCount={6}
        searchableColumnCount={1}
        filterableColumnCount={2}
        cellWidths={["2rem", "2rem", "2rem", "2rem", "2rem", "2rem"]}
        shrinkZero
        className="w-[95%] m-auto"
      />
    );
  }

  // Create columns with refresh callback
  const productionColumns = columns({
    onUpdate: () => fetchProductionList(dateRange.from, dateRange.to),
  });

  return (
    <div className="flex flex-col m-8">
      <h1 className="text-3xl font-bold border-b mb-4">Production List</h1>
      <div className="flex justify-between mb-4">
        <div></div>
        <div className="w-1/3">
          <DateRangePicker onDateRangeChange={handleDateRangeChange} />
        </div>
      </div>
      <DataTable
        columns={productionColumns}
        data={production}
        searchKey="Customer"
        defaultVisibilityOverrides={{
          "make": false,
          "powerRating": false
        }}
      />
    </div>
  );
}

export default ProductionDatatableList;
