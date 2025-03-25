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


export function DropdownSearch({
  placeholder,
  results,
  onSearch,
  onSelect,
  getDisplay,
  value,
  onChange,
}: {
  placeholder: string;
  results: { id: number; name: string }[];
  onSearch: (value: string) => void;
  onSelect: (result: { id: number; name: string }) => void;
  getDisplay: () => string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [popoverWidth, setPopoverWidth] = useState<number>(0);

  useEffect(() => {
    if (buttonRef.current) {
      setPopoverWidth(buttonRef.current.offsetWidth);
    }
  }, [buttonRef.current]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={buttonRef}
          variant="outline"
          role="combobox"
          className="w-full justify-between text-gray-600 mt-1"
          onClick={() => setOpen(true)}
        >
          {getDisplay() || placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent style={{ width: `${popoverWidth}px` }} className="p-0">
        <Command>
          <CommandInput
            placeholder={placeholder}
            value={value}
            onValueChange={(value: string) => {
              onChange?.(value);
              onSearch(value);
            }}
          />
          <CommandList className="bg-zinc-200">
            {results.length === 0 ? (
              <CommandEmpty>No options found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {results.map((result) => (
                  <CommandItem
                    key={result.id}
                    value={result.name}
                    onSelect={() => {
                      onSelect(result);                                                                                                                                                                                                                                                                                                            setOpen(false);
                    }}
                  >
                    {result.name}
                  </CommandItem>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
