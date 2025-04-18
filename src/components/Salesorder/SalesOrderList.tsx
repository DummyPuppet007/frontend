import { useCallback, useEffect, useState } from "react";
import { columns } from "./sales-columns";
import { DataTable } from "../Datatable/data-table";
import { DataTableSkeleton } from "../Datatable/data-table-skeleton";
import { DateRangePicker } from "../common/DateRangePicker";
import { SalesOrderList } from "@/utils/types/sales.types";
import { getAllSalesOrderList } from "@/services/SalesService";
import ErrorMessage from "../common/ErrorMessage";

function SalesOrderDatatableList() {
  const [salesorder, setSalesorder] = useState<SalesOrderList[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });

  const fetchSalesOrders = useCallback(async (fromDate?: Date, toDate?: Date) => {
    try {
      const response = await getAllSalesOrderList(fromDate, toDate);
      if (!response || response.statusCode !== 200) {
        setError(response.message);
        return;
      }
    
      setSalesorder(response.data || []);
    } catch (error: any) {
      setError(error.message);
    }
    finally{
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSalesOrders(dateRange.from, dateRange.to);
  }, [dateRange, fetchSalesOrders]);

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
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
        cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem", "8rem"]}
        shrinkZero
      />
    );
  }

  return (
    <div className="flex flex-col m-8">
      <h1 className="text-3xl font-bold border-b mb-4">Sales Order List</h1>
        <div className="flex justify-end mb-4">
          <div className="w-1/3">
            <DateRangePicker 
              onDateRangeChange={handleDateRangeChange}
            />
            </div>
        </div>
        <DataTable columns={columns} data={salesorder} searchKey="Customer" />
    </div>
  );
}

export default SalesOrderDatatableList;
