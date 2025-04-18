// sales.types.ts
import { 
  MachineModel, 
  MachineType, 
  Make, 
  PowerRating, 
  ProductionDetails, 
  User 
} from "./production.types";

// Alias User for creator and updater roles
export type Creator = User;
export type Updater = User;

// Customer definition shared within sales orders
export interface Customer {
  customerCode: string;
  customerName: string;
  customerId: number;
}

// SalesPerson definition
export interface SalesPerson {
  salesPersonId: number;
  salesPersonName: string;
}

// Dispatch status as an enum
export enum DispatchStatus {
  PENDING = "PENDING",
  DISPATCHED = "DISPATCHED",
  CANCELLED = "CANCELLED"
}

// A summarized version of a sales order (e.g. for listing)
export interface SalesOrderList {
  salesOrderId: number;
  salesOrderCode: string;
  soReceivedDate: string;
  firstAdvanceReceivedDate: string;
  customerId: number;
  orderValue: string;
  gstAmount: string;
  totalAmount: string;
  paymentReceived: string | null;
  orderStatus: string;
  pendingPayment: string | null;
  actualDispatchDate: string | null;
  salesInvoiceNumber: string | null;
  invoiceDate: string | null;
  comments: string | null;
  dispatchStatus: string;
  createdBy: number;
  createdAt: string; 
  updatedBy: number | null;
  updatedAt: string;
  isDeleted: boolean;
  customer: Customer;
  creator: Creator;
  updater: Updater | null;
}

// Detailed sales order detail record that uses production details
export interface SalesOrderDetail {
  machineModel: MachineModel;
  machineType: MachineType;
  powerRating: PowerRating;
  salesPerson: SalesPerson;
  make: Make;
  productionDetails: ProductionDetails;
}

// Full Sales Order interface
export interface SalesOrder {
  salesOrderId: number;
  salesOrderCode: string;
  soReceivedDate: string;
  firstAdvanceReceivedDate: string;
  customerId: number;
  orderValue: number;
  gstAmount: number;
  totalAmount?: number;
  paymentReceived?: number;
  orderStatus?: string;
  pendingPayment?: number;
  actualDispatchDate?: string | null;
  salesInvoiceNumber?: string;
  invoiceDate?: string | null;
  comments?: string;
  dispatchStatus?: DispatchStatus;
  createdBy: number;
  createdAt: string;
  updatedBy: number | null;
  updatedAt: string;
  isDeleted: boolean;
  salesOrderDetails: SalesOrderDetail[];
  customer: Customer;
  creator: Creator;
  updater: Updater | null;
}

// Creation interfaces for sales orders
export interface CreateSalesOrderDetail {
  machineTypeId: number;
  machineModelId: number;
  salesPersonId: number;
  powerRatingId: number;
  makeId: number;
  noOfMachines: number;
}

export interface CreateSalesOrder {
  soReceivedDate: string;
  firstAdvanceReceivedDate: string;
  customerId: number;
  orderValue: number;
  gstAmount: number;
  salesOrderDetails: CreateSalesOrderDetail[];
}

// If you prefer, you can simply alias CreateSalesOrderPayload to CreateSalesOrder.
export interface CreateSalesOrderPayload extends CreateSalesOrder {}

// Interfaces for updating sales orders
export interface BasicSalesOrderUpdate {
  soReceivedDate: string;
  firstAdvanceReceivedDate: string;
  orderValue: number;
  gstAmount: number;
  totalAmount: number;
}

export interface PaymentSalesOrderUpdate {
  paymentReceived: number;
  salesInvoiceNumber: string;
  invoiceDate: string | null;
  actualDispatchDate: string | null;
  comments: string;
  dispatchStatus: DispatchStatus;
}

// For production sales order updates, pick only the required fields from ProductionDetails.
export type ProductionSalesOrderUpdateDetails = Pick<
  ProductionDetails,
  "productionId" |
  "plannedStartDate" |
  "actualStartDate" |
  "estimatedCompletionDate" |
  "actualCompletionDate" |
  "comments" |
  "currentProgress"
>;

export interface ProductionSalesOrderUpdate {
  salesOrderDetails: {
    productionDetails: ProductionSalesOrderUpdateDetails;
  }[];
}
