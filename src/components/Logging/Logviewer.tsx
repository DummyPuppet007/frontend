// src/components/LogViewer.tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { LogData } from "./LoggingPage";

type LogViewerProps = {
  data: LogData | null;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export const LogViewer: React.FC<LogViewerProps> = ({
  data,
  currentPage,
  onPageChange,
}) => {
  const totalPages = data?.pagination
    ? Math.ceil(data.pagination.total / data.pagination.limit)
    : 1;

  return (
    <div className="container mx-auto p-4 bg-white min-h-screen">
      {data && data.logs.length > 0
        ? data.logs.map((log, index) => (
            <Card key={index} className="mb-4 border shadow-md">
              <CardContent className="p-2">
                <Accordion type="single" collapsible>
                  <AccordionItem
                    value={`item-${index}`}
                    className="border-none"
                  >
                    <AccordionTrigger className="py-3 px-2 hover:bg-gray-50 rounded">
                      <div className="flex flex-col items-start text-left w-full">
                        <div className="flex items-center gap-2 w-full">
                          <span
                            className={`
                        px-2 py-1 rounded text-xs font-medium
                        ${
                          log.level === "info"
                            ? "bg-green-100 text-green-700"
                            : ""
                        }
                        ${
                          log.level === "debug"
                            ? "bg-blue-100 text-blue-700"
                            : ""
                        }
                        ${
                          log.level === "error" ? "bg-red-100 text-red-700" : ""
                        }
                        ${
                          log.level === "warn"
                            ? "bg-yellow-100 text-yellow-700"
                            : ""
                        }
                        ${
                          log.level === "http"
                            ? "bg-gray-100 text-gray-700"
                            : ""
                        }
                      `}
                          >
                            {log.level.toUpperCase()}
                          </span>
                          <span className="text-sm font-medium truncate">
                            {log.message}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          {new Date(log.timestamp).toLocaleString()} -{" "}
                          {log.file}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-0 pb-2 px-2">
                      <pre className="bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto text-xs">
                        <code>{JSON.stringify(log, null, 2)}</code>
                      </pre>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))
        : !data && <p className="text-center text-gray-700">No logs found.</p>}

      {/* Pagination Footer */}
      {data && (
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-white mt-4">
          <span className="text-gray-700">
            Page {data.pagination.page} of {totalPages} - Total Logs:{" "}
            {data.pagination.total}
          </span>
          <div className="space-x-2">
            <Button
              disabled={data.pagination.page === 1}
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            >
              Previous
            </Button>
            <Button
              disabled={
                !data.pagination.hasMore || data.pagination.page >= totalPages
              }
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
