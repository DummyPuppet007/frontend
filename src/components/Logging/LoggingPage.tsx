// src/components/Logging/LoggingPage.tsx
import { useEffect, useState } from "react";
import { DateRangePicker } from "../common/DateRangePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { LogViewer } from "./Logviewer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { getLogsFileList, getAllLogsDetails } from "@/services/LogsService";
import ErrorMessage from "../common/ErrorMessage";
import { DateRange } from "react-day-picker";
import { FilterIcon, Loader2 } from "lucide-react";
import Loading from "../common/Loading";

type LogEntry = {
  timestamp: string;
  file: string;
  level: string;
  message: string;
  metadata: Record<string, any>;
};

type Pagination = {
  page: number;
  limit: number;
  hasMore: boolean;
  total: number;
};

export type LogData = {
  filename: string;
  logs: LogEntry[];
  pagination: Pagination;
};

function LoggingPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [logsData, setLogsData] = useState<LogData | null>(null);
  const [selectedLog, setSelectedLog] = useState<string>("");
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await getLogsFileList();
      if (response.success && response.data) {
        setLogs(response.data);
        return;
      }
      setError(response.message || "Failed to fetch logs");
    } catch (error: any) {
      console.error("Error fetching logs:", error);
      setError("Failed to fetch logs" + error.message);
    }
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    handleFilter();
  };

  const handleFilter = async () => {
    setLoading(true);
    const filters = {
      logFile: selectedLog,
      startDate: dateRange?.from?.toISOString(),
      endDate: dateRange?.to?.toISOString(),
      startTime,
      endTime,
      page: currentPage,
      limit,
    };

    try {
      const response = await getAllLogsDetails(filters);
      if (response.success && response.data) {
        setLogsData(response.data);
        setError(null);
        return;
      }
      setError(response.message || "Failed to fetch logs");
    } catch (error: any) {
      console.error("Error fetching logs:", error);
      setError("Failed to fetch logs" + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col m-8">
      <h1 className="text-3xl text-start font-bold border-b pb-2 mb-4">
        System Logs
      </h1>
      {error && <ErrorMessage message={error} className="m-4" />}
      {loading && <Loading />}

      <div className="p-4 bg-white rounded-lg shadow-lg border border-gray-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Log Filters</h3>
          <Button
            onClick={handleFilter}
            variant="default"
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FilterIcon className="h-4 w-4" />
            )}
            Apply Filters
          </Button>
        </div>

        {/* Filter Controls - 2 rows grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Log Selector */}
          <div className="space-y-2">
            <Label htmlFor="log-select">Log Type</Label>
            <Select value={selectedLog} onValueChange={setSelectedLog}>
              <SelectTrigger id="log-select" className="w-full">
                <SelectValue placeholder="Select Log" />
              </SelectTrigger>
              <SelectContent>
                {logs.map((log) => (
                  <SelectItem key={log} value={log}>
                    {log}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <DateRangePicker onDateRangeChange={handleDateRangeChange} />
          </div>

          {/* Limit */}
          <div className="space-y-2">
            <Label htmlFor="limit-input">Results Limit</Label>
            <Input
              id="limit-input"
              type="number"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full"
              min={1}
              max={1000}
            />
          </div>

          {/* Time Range - Only show if date is selected */}
          {dateRange.from && (
            <div className="space-y-2 md:col-span-2 lg:col-span-3">
              <Label>Time Range</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full"
                />
                <span className="text-gray-500">to</span>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <LogViewer
        data={logsData}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default LoggingPage;
