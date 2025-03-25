import { Controller } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DropdownSearch } from "./DropdownSearch";

export interface CommonFieldProps {
    name: string;
    control: any;
    label: string;
    type: "text" | "password" | "select" | "searchableSelect";
    options?: { id: number; name: string }[];
    placeholder?: string;
    rules?: any;
    onSearch?: (query: string) => void;
    onSelect?: (option: any) => void;
}

const CommonField: React.FC<CommonFieldProps> = ({
    name,
    control,
    label,
    type,
    options = [],
    placeholder,
    rules,
    onSearch,
    onSelect
}) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState: { error } }) => (
                <div className="grid grid-cols-4 items-start gap-4 m-2">
                    <Label htmlFor={name} className="text-right mt-2">{label} :</Label>
                    <div className="col-span-3">
                        {type === "text" || type === "password" ? (
                            <Input
                                type={type}
                                placeholder={placeholder}
                                value={field.value}
                                onChange={field.onChange}
                                className="w-full bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 p-2"
                            />
                        ) : type === "select" ? (
                            <Select onValueChange={(value) => field.onChange(Number(value))} 
                            value={field.value ? field.value.toString() : ""}>
                                <SelectTrigger className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder={placeholder} />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-300">
                                    {options.map(option => (
                                        <SelectItem key={option.id} value={String(option.id)}>
                                            {option.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : type === "searchableSelect" ? (
                            <DropdownSearch
                                placeholder={placeholder || "Select an Option"}
                                results={options}
                                onSearch={onSearch!}
                                onSelect={(option) => {
                                    field.onChange(option.id);
                                    if (onSelect) onSelect(option);
                                }}
                                getDisplay={() => field.value ? options.find(opt => opt.id === field.value)?.name || "Select" : `Select ${label}`}
                            />
                        ) : null}
                        <p className="text-red-500 text-sm min-h-[20px] font-medium">{error?.message}</p>
                    </div>
                </div>
            )}
        />
    );
};

export default CommonField;