import { useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormLabel } from "../ui/form";
import { cn } from "@/lib/utils";

interface DropdownSearchProps {
  placeholder: string;
  results: { id: number; name: string }[];
  onSearch: (value: string) => void;
  onSelect: (result: { id: number; name: string }) => void;
  getDisplay: () => string;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: boolean;
}

export function DropdownSearch({
  placeholder,
  results,
  onSearch,
  onSelect,
  getDisplay,
  value,
  onChange,
  label,
  error,
}: DropdownSearchProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverContentRef = useRef<HTMLDivElement>(null);
  const [popoverWidth, setPopoverWidth] = useState<number>(0);

  useEffect(() => {
    if (buttonRef.current) {
      setPopoverWidth(buttonRef.current.offsetWidth);
    }
  }, [buttonRef.current]);

  // Handle wheel events to prevent page scrolling when dropdown is open
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (open && popoverContentRef.current?.contains(e.target as Node)) {
        e.stopPropagation();
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    return () => {
      document.removeEventListener('wheel', handleWheel, { capture: true });
    };
  }, [open]);

  return (
    <div className="flex flex-col gap-2">
      {label && <FormLabel>{label}</FormLabel>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={buttonRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between text-gray-700 truncate",
              error && "border-red-500"
            )}
            title={getDisplay()}
          >
            <span className="truncate">{getDisplay() || placeholder}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          ref={popoverContentRef}
          style={{ width: popoverWidth }} 
          className="p-0 overflow-auto"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command>
            <CommandInput
              placeholder={placeholder}
              value={value}
              onValueChange={(currentValue) => {
                onChange?.(currentValue);
                onSearch(currentValue);
              }}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {results.map((result) => (
                  <CommandItem
                    key={result.id}
                    value={result.name}
                    onSelect={() => {
                      onSelect(result);
                      setOpen(false);
                    }}
                  >
                    {result.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}