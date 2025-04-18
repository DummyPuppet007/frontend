import {z} from 'zod';

export const orderDetailSchema = z.object({
  machineTypeId: z
    .number({ required_error: "Machine Type ID is required" })
    .positive("Machine Type ID must be a positive number"),
  machineModelId: z
    .number({ required_error: "Machine Model ID is required" })
    .positive("Machine Model ID must be a positive number"),
  salesPersonId: z
    .number({ required_error: "Sales Person ID is required" })
    .positive("Sales Person ID must be a positive number"),
  powerRatingId: z
    .number({ required_error: "Power Rating ID is required" })
    .positive("Power Rating ID must be a positive number"),
  makeId: z
    .number({ required_error: "Make ID is required" })
    .positive("Make ID must be a positive number"),
  noOfMachines: z
    .number({ required_error: "Number of Machines is required" })
    .positive("Number of Machines must be a positive number"),
});

// Main sales order schema
export const salesorderSchema = z.object({
  soReceivedDate: z.date({ required_error: "SO Received Date is required" }),
  firstAdvanceReceivedDate: z.date({
    required_error: "First Advance Received Date is required",
  }),
  customerId: z.number({ required_error: "Customer ID is required" }),
  customerName: z.string({ required_error: "Customer Name is required" }),
  orderValue: z
    .number({ required_error: "Order value is required" })
    .positive("Order value must be a positive number"),
  gstAmount: z
    .number({ required_error: "GST amount is required" })
    .positive("GST amount must be a positive number"),
  details: z
    .array(orderDetailSchema)
    .nonempty("At least one order detail is required."),
});
