import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { FormLabel } from "@/components/ui/form";

interface DatePickerProps {
  label?: string;
  value?: Date;
  onChange: (date?: Date) => void;
  placeholder?: string;
  error?: boolean;
  disableAfterDate?: Date; // Optional prop to disable dates after a specific date
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = "Pick a date",
  error,
  disableAfterDate, // New prop
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      {label && <FormLabel>{label}</FormLabel>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              error && "border-red-500"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
            // Conditional disable logic
            disabled={(date) => {
              if (!disableAfterDate) {
                // If no disableAfterDate is provided, disable all dates
                return true;
              }
              // Disable dates after the specified disableAfterDate
              return date > disableAfterDate || date < new Date("1900-01-01");
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};