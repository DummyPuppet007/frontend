import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useCallback } from "react";
import debounce from "lodash.debounce";
import axios from "axios";
import { DatePicker } from "../common/DatePicker";
import { DropdownSearch } from "../common/DropdownSearch";
import { salesorderSchema } from "@/utils/validations/salesOrderValidations";
import { SearchResult } from "@/utils/types/common.types";
import { Plus } from "lucide-react";
import { TooltipWrapper } from "../common/Tooltip";
import { createNewSalesOrder } from "@/services/SalesService";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../common/ErrorMessage";
import { AnimatePresence, motion } from "framer-motion";
import { OrderDetailsCard } from "./OrderDetailsCard";

export default function CreateSalesOrder() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof salesorderSchema>>({
    resolver: zodResolver(salesorderSchema),
    defaultValues: {
      soReceivedDate: undefined,
      firstAdvanceReceivedDate: undefined,
      customerId: undefined,
      customerName: "",
      orderValue: 0,
      gstAmount: 0,
      details: [
        {
          machineTypeId: 0,
          machineModelId: 0,
          salesPersonId: 0,
          powerRatingId: 0,
          makeId: 0,
          noOfMachines: 0,
        },
      ],
    },
  });

  const handleSearchChange = useCallback(
    debounce(async (value: string, type: string) => {
      if (value.length >= 2) {
        const response = await axios.get(
          `https://localhost:8081/api/${type}/search?name=${value}`,
          { withCredentials: true }
        );
        if (type === "customer") {
          setSearchResults(
            response.data.data.map((customer: any) => ({
              id: customer.customerId,
              name: customer.customerName,
            }))
          );
        }
      } else {
        setSearchResults([]);
      }
    }, 300),
    []
  );

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "details",
  });

  async function onSubmit(values: z.infer<typeof salesorderSchema>) {
    setLoading(true);
    try {
      const salesorderPayload = {
        soReceivedDate: values.soReceivedDate.toISOString(),
        firstAdvanceReceivedDate: values.firstAdvanceReceivedDate.toISOString(),
        customerId: values.customerId,
        orderValue: values.orderValue,
        gstAmount: values.gstAmount,
        salesOrderDetails: values.details.map((detail) => ({
          machineTypeId: detail.machineTypeId,
          machineModelId: detail.machineModelId,
          salesPersonId: detail.salesPersonId,
          powerRatingId: detail.powerRatingId,
          makeId: detail.makeId,
          noOfMachines: detail.noOfMachines,
        })),
      };

      const response = await createNewSalesOrder(salesorderPayload);

      if (!response.success) {
        setError(response.message || "Failed to create sales order");
        return;
      }

      navigate("/dashboard/sales-order");
    } catch (error) {
      console.error("Error creating sales order:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create sales order"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col m-8">
      {error && <ErrorMessage message={error} />}

      <h1 className="text-3xl text-start font-bold border-b">
        Create Sales Order
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
          {/* Date Fields */}
          <div className="grid lg:grid-cols-2 gap-4">
            {/* SO Received Date */}
            <FormField
              control={form.control}
              name="soReceivedDate"
              render={({ field, fieldState }) => (
                <FormItem>
                  <DatePicker
                    label="SO Received Date:"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select SO Received Date"
                    error={!!fieldState.error}
                    disableAfterDate={new Date()}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* First Advance Received Date */}
            <FormField
              control={form.control}
              name="firstAdvanceReceivedDate"
              render={({ field, fieldState }) => (
                <FormItem>
                  <DatePicker
                    label="First Advance Received Date:"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select Advance Received Date"
                    error={!!fieldState.error}
                    disableAfterDate={new Date()}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Customer Search */}
          <FormField
            control={form.control}
            name="customerId"
            render={({ field, fieldState }) => (
              <FormItem>
                <DropdownSearch
                  label="Search Customer"
                  placeholder="Search by Customer Name..."
                  results={searchResults}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  onSearch={(value) => handleSearchChange(value, "customer")}
                  onSelect={(result) => field.onChange(result.id)}
                  getDisplay={() =>
                    field.value
                      ? searchResults.find((mt) => mt.id === field.value)
                          ?.name || ""
                      : ""
                  }
                  error={!!fieldState.error}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Order Value and GST Amount */}
          <div className="grid lg:grid-cols-2 gap-4">
            <div>
              <FormField
                control={form.control}
                name="orderValue"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Order Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="gstAmount"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>GST Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Order Details Section */}
          <div className="mt-8">
            <motion.div
              // className="space-y-4"
              // layout
              // transition={{
              //   duration: 0.3,
              //   type: "tween",
              //   stiffness: 200,
              //   damping: 30,
              // }}

              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between">
                <h2 className="text-2xl font-bold mb-4">Order Details</h2>

                <TooltipWrapper
                  trigger={
                    <Button
                      type="button"
                      className="bg-blue-950"
                      onClick={() =>
                        append({
                          machineTypeId: 0,
                          machineModelId: 0,
                          salesPersonId: 0,
                          powerRatingId: 0,
                          makeId: 0,
                          noOfMachines: 0,
                        })
                      }
                    >
                      <Plus className="font-bold size-6" />
                    </Button>
                  }
                  content={<p>Add New Order Details</p>}
                />
              </div>
              <AnimatePresence>
                {fields.map((fieldItem, index) => (
                  <OrderDetailsCard
                    key={fieldItem.id}
                    index={index}
                    control={form.control}
                    onRemove={() => remove(index)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating Sales Order..." : "Create Sales Order"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
