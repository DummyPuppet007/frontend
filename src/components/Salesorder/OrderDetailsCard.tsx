import { useState, useCallback } from "react";
import debounce from "lodash.debounce";
import axios from "axios";
import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { TooltipWrapper } from "../common/Tooltip";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { DropdownSearch } from "../common/DropdownSearch";
import { SearchResult } from "@/utils/types/common.types";
import { Control } from "react-hook-form";

interface OrderDetailsCardProps {
  index: number;
  control: Control<any>;
  onRemove: () => void;
}

export function OrderDetailsCard({ index, control, onRemove }: OrderDetailsCardProps) {
  const [machineTypeResults, setMachineTypeResults] = useState<SearchResult[]>([]);
  const [machineModelResults, setMachineModelResults] = useState<SearchResult[]>([]);
  const [salesPersonResults, setSalesPersonResults] = useState<SearchResult[]>([]);
  const [powerRatingResults, setPowerRatingResults] = useState<SearchResult[]>([]);
  const [makeResults, setMakeResults] = useState<SearchResult[]>([]);

  const handleSearchChange = useCallback(
    debounce(async (value: string, type: string) => {
      if (value.length >= 2) {
        const response = await axios.get(
          `https://localhost:8081/api/${type}/search?name=${value}`,
          { withCredentials: true }
        );
        switch (type) {
          case "production/get-machine-type":
            setMachineTypeResults(
              response.data.data.map((type: any) => ({
                id: type.machineTypeId,
                name: type.machineTypeName,
              }))
            );
            break;
          case "production/get-machine-model":
            setMachineModelResults(
              response.data.data.map((model: any) => ({
                id: model.machineModelId,
                name: model.machineModelName,
              }))
            );
            break;
          case "sales/get-sales-person":
            setSalesPersonResults(
              response.data.data.map((sales: any) => ({
                id: sales.salesPersonId,
                name: sales.salesPersonName,
              }))
            );
            break;
          case "production/get-power-rating":
            setPowerRatingResults(
              response.data.data.map((power: any) => ({
                id: power.powerRatingId,
                name: power.powerRating,
              }))
            );
            break;
          case "production/get-make":
            setMakeResults(
              response.data.data.map((make: any) => ({
                id: make.makeId,
                name: make.makeName,
              }))
            );
            break;
        }
      } else {
        switch (type) {
          case "production/get-machine-type":
            setMachineTypeResults([]);
            break;
          case "production/get-machine-model":
            setMachineModelResults([]);
            break;
          case "sales/get-sales-person":
            setSalesPersonResults([]);
            break;
          case "production/get-power-rating":
            setPowerRatingResults([]);
            break;
          case "production/get-make":
            setMakeResults([]);
            break;
        }
      }
    }, 300),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="px-4 py-12 mb-4 rounded-md border border-neutral-400 shadow-lg relative">
        {/* Remove Detail Button */}
        <div className="absolute right-0 top-0 p-2">
          <TooltipWrapper
            trigger={
              <Button variant="destructive" onClick={onRemove} type="button">
                <Trash />
              </Button>
            }
            content={<p>Delete this Block</p>}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Machine Type - Searchable */}
          <FormField
            control={control}
            name={`details.${index}.machineTypeId`}
            render={({ field }) => (
              <FormItem className="flex flex-col relative">
                <FormLabel>Machine Type</FormLabel>
                <FormControl>
                  <DropdownSearch
                    placeholder="Search Machine Type..."
                    results={machineTypeResults}
                    onSearch={(value) =>
                      handleSearchChange(value, "production/get-machine-type")
                    }
                    onSelect={(result) => field.onChange(result.id)}
                    getDisplay={() =>
                      field.value
                        ? machineTypeResults.find((mt) => mt.id === field.value)
                            ?.name || ""
                        : ""
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Machine Model - Searchable */}
          <FormField
            control={control}
            name={`details.${index}.machineModelId`}
            render={({ field }) => (
              <FormItem className="flex flex-col relative">
                <FormLabel>Machine Model</FormLabel>
                <FormControl>
                  <DropdownSearch
                    placeholder="Search Machine Model..."
                    results={machineModelResults}
                    onSearch={(value) =>
                      handleSearchChange(value, "production/get-machine-model")
                    }
                    onSelect={(result) => field.onChange(result.id)}
                    getDisplay={() =>
                      field.value
                        ? machineModelResults.find((mm) => mm.id === field.value)
                            ?.name || ""
                        : ""
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sales Person - Searchable */}
          <FormField
            control={control}
            name={`details.${index}.salesPersonId`}
            render={({ field }) => (
              <FormItem className="flex flex-col relative">
                <FormLabel>Sales Person</FormLabel>
                <FormControl>
                  <DropdownSearch
                    placeholder="Search Sales Person..."
                    results={salesPersonResults}
                    onSearch={(value) =>
                      handleSearchChange(value, "sales/get-sales-person")
                    }
                    onSelect={(result) => field.onChange(result.id)}
                    getDisplay={() =>
                      field.value
                        ? salesPersonResults.find((sp) => sp.id === field.value)
                            ?.name || ""
                        : ""
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Power Rating - Searchable */}
          <FormField
            control={control}
            name={`details.${index}.powerRatingId`}
            render={({ field }) => (
              <FormItem className="flex flex-col relative">
                <FormLabel>Power Rating</FormLabel>
                <FormControl>
                  <DropdownSearch
                    placeholder="Search Power Rating..."
                    results={powerRatingResults}
                    onSearch={(value) =>
                      handleSearchChange(value, "production/get-power-rating")
                    }
                    onSelect={(result) => field.onChange(result.id)}
                    getDisplay={() =>
                      field.value
                        ? powerRatingResults.find((pr) => pr.id === field.value)
                            ?.name || ""
                        : ""
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Make - Searchable */}
          <FormField
            control={control}
            name={`details.${index}.makeId`}
            render={({ field }) => (
              <FormItem className="flex flex-col relative">
                <FormLabel>Make</FormLabel>
                <FormControl>
                  <DropdownSearch
                    placeholder="Search Make..."
                    results={makeResults}
                    onSearch={(value) => handleSearchChange(value, "production/get-make")}
                    onSelect={(result) => field.onChange(result.id)}
                    getDisplay={() =>
                      field.value
                        ? makeResults.find((m) => m.id === field.value)?.name || ""
                        : ""
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Number of Machines */}
          <FormField
            control={control}
            name={`details.${index}.noOfMachines`}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Number of Machines</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Card>
    </motion.div>
  );
}
