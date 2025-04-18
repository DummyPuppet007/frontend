import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";

import { Button, type ButtonProps } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useQueryStates } from "@/hooks/useQueryState";

interface DateRangePickerProps
  extends React.ComponentPropsWithoutRef<typeof PopoverContent> {
  /**
   * The selected date range.
   * @default undefined
   * @type DateRange
   * @example { from: new Date(), to: new Date() }
   */
  defaultDateRange?: DateRange;

  /**
   * The placeholder text of the calendar trigger button.
   * @default "Pick a date"
   * @type string | undefined
   */
  placeholder?: string;

  /**
   * The variant of the calendar trigger button.
   * @default "outline"
   * @type "default" | "outline" | "secondary" | "ghost"
   */
  triggerVariant?: Exclude<ButtonProps["variant"], "destructive" | "link">;

  /**
   * The size of the calendar trigger button.
   * @default "default"
   * @type "default" | "sm" | "lg"
   */
  triggerSize?: Exclude<ButtonProps["size"], "icon">;

  /**
   * The class name of the calendar trigger button.
   * @default undefined
   * @type string
   */
  triggerClassName?: string;

  /**
   * Controls whether query states are updated client-side only (default: true).
   * Setting to `false` triggers a network request to update the querystring.
   * @default true
   */
  shallow?: boolean;

  onDateRangeChange?: (dateRange: { from: Date | undefined; to: Date | undefined }) => void;
}

export function DateRangePicker({
  defaultDateRange,
  placeholder = "Pick a date",
  triggerVariant = "outline",
  triggerSize = "default",
  triggerClassName,
  shallow = true,
  className,
  onDateRangeChange,
  ...props
}: DateRangePickerProps) {
  // Initialize query states with default dates (if any)
  const [dateParams, setDateParams] = useQueryStates(
    {
      from: defaultDateRange?.from?.toISOString() ?? "",
      to: defaultDateRange?.to?.toISOString() ?? "",
    },
    shallow
  );

  // Parse the dates. If the query param is an empty string, we treat it as cleared.
  const date = React.useMemo(() => {
    const parseDate = (dateString: string): Date | undefined => {
      if (!dateString) return undefined;
      const parsedDate = new Date(dateString);
      return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate;
    };

    return {
      from: dateParams.from ? parseDate(dateParams.from) : undefined,
      to: dateParams.to ? parseDate(dateParams.to) : undefined,
    };
  }, [dateParams]);

  // Add effect to call onDateRangeChange when dates change
  React.useEffect(() => {
    onDateRangeChange?.(date);
  }, [date, onDateRangeChange]);

  // Handler to reset the date range.
  const handleReset = () => {
    setDateParams({ from: "", to: "" });
  };

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={triggerVariant}
            size={triggerSize}
            className={cn(
              "w-full justify-start gap-2 truncate text-left font-normal border border-gray-300",
              !date?.from && "text-muted-foreground",
              triggerClassName
            )}
          >
            <CalendarIcon className="size-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span className="text-black">{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("w-auto p-0", className)} {...props}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDateRange) => {
              setDateParams({
                from: newDateRange?.from?.toISOString() ?? "",
                to: newDateRange?.to?.toISOString() ?? "",
              });
            }}
            numberOfMonths={2}
          />
          {/* Reset Button */}
          <div className="flex justify-end border-t px-2 py-1 bg-gray-100">
            <Button variant="ghost" className="text-black" size="sm" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}