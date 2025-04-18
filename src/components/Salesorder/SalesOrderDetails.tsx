import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PenBox } from "lucide-react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { DatePicker } from "../common/DatePicker";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select";
import { 
  SalesOrder, 
  BasicSalesOrderUpdate, 
  PaymentSalesOrderUpdate, 
  ProductionSalesOrderUpdate,  
  DispatchStatus 
} from "@/utils/types/sales.types";
import { getCompleteSalesOrderDetail, updateSalesOrderDetails } from "@/services/SalesService";
import ErrorMessage from "../common/ErrorMessage";
import toast from "react-hot-toast";
import { ProductionDetails } from "@/utils/types/production.types";

const initialSalesOrder: SalesOrder = {
  salesOrderId: 0,
  salesOrderCode: "",
  soReceivedDate: "",
  firstAdvanceReceivedDate: "",
  customerId: 0,
  orderValue: 0,
  gstAmount: 0,
  totalAmount: 0,
  paymentReceived: 0,
  orderStatus: "",
  pendingPayment: 0,
  actualDispatchDate: null,
  salesInvoiceNumber: "",
  invoiceDate: null,
  comments: "",
  dispatchStatus: DispatchStatus.PENDING,
  createdBy: 0,
  createdAt: "",
  updatedBy: null,
  updatedAt: "",
  isDeleted: false,
  salesOrderDetails: [{
    machineModel: {
      machineModelId: 0,
      machineModelName: "",
    },
    machineType: {
      machineTypeName: "",
      machineTypeId: 0,
    },
    powerRating: {
      powerRating: "",
      powerRatingId: 0,
    },
    salesPerson: {
      salesPersonId: 0,
      salesPersonName: "",
    },
    make: {
      makeId: 0,
      makeName: "",
    },
    productionDetails: {
      productionId: 0,
      salesorderDetailsId: 0,
      productionOrderCode: "",
      plannedStartDate: null,
      actualStartDate: null,
      estimatedCompletionDate: null,
      actualCompletionDate: null,
      comments: "",
      currentProgress: 0,
      isDeleted: false,
      createdBy: 0,
      createdAt: "",
      updatedBy: null,
      updatedAt: "",
    }
  }],
  customer: {
    customerCode: "",
    customerName: "",
    customerId: 0,
  },
  creator: {
    userId: 0,
    username: "",
  },
  updater: null,
};

export default function SalesOrderDetails() {
  useEffect(() => {
    fetchDetails();
  }, []);

  const [salesDetails, setSalesDetails] = useState<SalesOrder>(initialSalesOrder);
  const [formData, setFormData] = useState<SalesOrder>(initialSalesOrder);
  const [editingProductionIndex, setEditingProductionIndex] = useState<number | null>(null);
  const [isEditingBasic, setIsEditingBasic] = useState<boolean>(false);
  const [isEditingPayment, setIsEditingPayment] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { soId } = useParams();

  const handleEditing = (section: string, index?: number) => {
    switch (section) {
      case "basic":
        setIsEditingBasic(true);
        break;
      case "payment":
        setIsEditingPayment(true);
        break;
      case "production":
        setEditingProductionIndex(index ?? null);
        break;
    }
  };

  const handleCancelEdit = (section: string) => {
    switch (section) {
      case "basic":
        setIsEditingBasic(false);
        break;
      case "payment":
        setIsEditingPayment(false);
        break;
      case "production":
        setEditingProductionIndex(null);
        break;
    }
    setFormData(salesDetails); // Reset to original data
  };

  const handleProductionDateChange = (
    index: number,
    field: keyof ProductionDetails,
    date: Date | undefined
  ) => {
    const updatedDetails = { ...formData };
    const productionDetails = updatedDetails.salesOrderDetails[index]?.productionDetails;
    
    if (productionDetails) {
      const newProductionDetails = {
        ...productionDetails,
        [field]: date?.toISOString() || null
      };
      
      updatedDetails.salesOrderDetails[index].productionDetails = newProductionDetails;
      setFormData(updatedDetails);
    }
  };

  const handleProductionCommentChange = (index: number, comment: string) => {
    const updatedDetails = { ...formData };
    if (updatedDetails.salesOrderDetails[index]?.productionDetails) {
      updatedDetails.salesOrderDetails[index].productionDetails.comments = comment;
      setFormData(updatedDetails);
    }
  };

  const fetchDetails = async () => {
    try {
      const completeSalesorderDetails = await getCompleteSalesOrderDetail(Number(soId));
      if (completeSalesorderDetails.success && completeSalesorderDetails.data) {
        setSalesDetails(completeSalesorderDetails.data);
        setFormData(completeSalesorderDetails.data);
        setError(null);
      } else {
        setError(completeSalesorderDetails.message || "Failed to fetch sales order details.");
      }
    } catch (error) {
      console.error("Error fetching details:", error);
      setError("Failed to fetch sales order details.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!formData) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name: string) => (date: Date | undefined) => {
    setFormData({ ...formData, [name]: date?.toISOString() });
  };

  const handleSave = async (section: string) => {
    try {
      let dataToSend: BasicSalesOrderUpdate | PaymentSalesOrderUpdate | ProductionSalesOrderUpdate;
      
      switch (section) {
        case "basic":
          dataToSend = {
            soReceivedDate: formData.soReceivedDate || "",
            firstAdvanceReceivedDate: formData.firstAdvanceReceivedDate || "",
            orderValue: formData.orderValue || 0,
            gstAmount: formData.gstAmount || 0,
            totalAmount: formData.totalAmount || 0
          };
          break;
          
        case "payment":
          dataToSend = {
            paymentReceived: formData.paymentReceived || 0,
            salesInvoiceNumber: formData.salesInvoiceNumber || "",
            invoiceDate: formData.invoiceDate || null,
            actualDispatchDate: formData.actualDispatchDate || null,
            comments: formData.comments || "",
            dispatchStatus: formData.dispatchStatus || DispatchStatus.PENDING
          };
          break;
          
        case "production":
          dataToSend = {
            salesOrderDetails: formData.salesOrderDetails.map(detail => ({
              productionDetails: {
                productionId: detail.productionDetails.productionId,
                plannedStartDate: detail.productionDetails.plannedStartDate,
                actualStartDate: detail.productionDetails.actualStartDate,
                estimatedCompletionDate: detail.productionDetails.estimatedCompletionDate,
                actualCompletionDate: detail.productionDetails.actualCompletionDate,
                comments: detail.productionDetails.comments,
                currentProgress: detail.productionDetails.currentProgress
              }
            }))
          };
          break;
          
        default:
          throw new Error("Invalid section");
      }

      const response = await updateSalesOrderDetails(Number(soId), dataToSend, section);
      
      if (response.success && response.data) {
        fetchDetails();
        handleCancelEdit(section);
        setError(null);
      } else {
        setError(response.message || "Failed to update sales order details.");
      }
    } catch (error) {
      console.error("Error saving details:", error);
      setError("Failed to update sales order details.");
    }
  };

  const closeOrCancelSalesOrder = async (type: string) => {
    try {
      const response = await updateSalesOrderDetails(Number(soId), type, "status");
      
      if (response.success && response.data) {
        fetchDetails();
        toast.success("Sales order status updated successfully.");
        setError(null);
      } else {
        setError(response.message || "Failed to update sales order status.");
      }
    } catch (error: any) {
      setError(error.message || "Failed to update sales order status.");
    }
  }

  return (
    <>
    {error && <ErrorMessage message={error} className="mx-8 my-2" />}
    <div className="flex flex-col m-8 space-y-8">
      {/* Section 1: Basic Details */}
      <Card className="p-6 border border-gray-300 shadow-xl">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">
            Sales Order Details
            <span className="text-gray-700 ml-2">
              ({formData?.salesOrderCode})
            </span>
          </h2>
          <div className="flex items-center space-x-4">
            <Badge
              className={`h-8 text-center min-w-20 text-xl pointer-events-none
                ${
                  formData.orderStatus === "OPEN"
                    ? "bg-green-800"
                    : formData.orderStatus === "CLOSED"
                    ? "bg-gray-800"
                    : "bg-yellow-800"
                }`}
            >
              {formData.orderStatus}
            </Badge>
            {!isEditingBasic && formData.orderStatus === "OPEN" && (
              <PenBox
                className="h-6 w-6 text-blue-900 cursor-pointer"
                onClick={() => handleEditing("basic")}
              />
            )}
            {isEditingBasic && (
              <div className="space-x-2">
                <Button size="sm" onClick={() => handleSave("basic")}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleCancelEdit("basic")}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
        <Separator className="border mb-4" />

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label className="text-gray-600">SO Received Date</Label>
            {isEditingBasic ? (
              <DatePicker
                value={
                  formData.soReceivedDate
                    ? new Date(formData.soReceivedDate)
                    : undefined
                }
                onChange={handleDateChange("soReceivedDate")}
                // className="w-full"
                disableAfterDate={new Date()}
              />
            ) : (
              <p className="mt-1 font-medium">
                {formData.soReceivedDate
                  ? format(new Date(formData.soReceivedDate), "MMMM d, yyyy")
                  : "Not set"}
              </p>
            )}
          </div>

          <div>
            <Label className="text-gray-600">First Advance Received Date</Label>
            {isEditingBasic ? (
              <DatePicker
                value={
                  formData.firstAdvanceReceivedDate
                    ? new Date(formData.firstAdvanceReceivedDate)
                    : undefined
                }
                onChange={handleDateChange("firstAdvanceReceivedDate")}
                // className="w-full"
                disableAfterDate={new Date()}
              />
            ) : (
              <p className="mt-1 font-medium">
                {formData.firstAdvanceReceivedDate
                  ? format(
                      new Date(formData.firstAdvanceReceivedDate),
                      "MMMM d, yyyy"
                    )
                  : "Not set"}
              </p>
            )}
          </div>

          <div>
            <Label className="text-gray-600">Customer</Label>
            <p className="mt-1 font-medium">
              {formData.customer.customerName} ({formData.customer.customerCode}
              )
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 col-span-2">
            <div>
              <Label className="text-gray-600">Order Value</Label>
              {isEditingBasic ? (
                <Input
                  type="number"
                  name="orderValue"
                  value={formData.orderValue}
                  onChange={handleChange}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 font-medium">₹{formData.orderValue}</p>
              )}
            </div>

            <div>
              <Label className="text-gray-600">GST Amount</Label>
              {isEditingBasic ? (
                <Input
                  type="number"
                  name="gstAmount"
                  value={formData.gstAmount}
                  onChange={handleChange}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 font-medium">₹{formData.gstAmount}</p>
              )}
            </div>

            <div>
              <Label className="text-gray-600">Total Amount</Label>
              <p className="mt-1 font-bold text-lg">₹{formData.totalAmount}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Section 2: Payment Details */}
      <Card className="p-6 border border-gray-300 shadow-xl">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">Payment & Dispatch Details</h2>
          {!isEditingPayment && formData.orderStatus === "OPEN" && (
            <PenBox
              className="h-6 w-6 text-blue-900 cursor-pointer"
              onClick={() => handleEditing("payment")}
            />
          )}
          {isEditingPayment && (
            <div className="space-x-2">
              <Button size="sm" onClick={() => handleSave("payment")}>
                Save
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleCancelEdit("payment")}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
        <Separator className="border mb-4" />
        <div className="grid grid-cols-3 gap-6">
          <div>
            <Label className="text-gray-600">Payment Received</Label>
            {isEditingPayment ? (
              <Input
                type="number"
                name="paymentReceived"
                value={formData.paymentReceived}
                onChange={handleChange}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 font-medium">₹{formData.paymentReceived}</p>
            )}
          </div>

          <div>
            <Label className="text-gray-600">Pending Payment</Label>
            <p className="mt-1 font-medium">₹{formData.pendingPayment}</p>
          </div>

          <div>
            <Label className="text-gray-600 block">Dispatch Status</Label>
            {isEditingPayment ? (
              <Select
                value={formData.dispatchStatus}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    dispatchStatus: value as DispatchStatus,
                  })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select dispatch status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(DispatchStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Badge
                className={`mt-2 pointer-events-none ${
                  formData.dispatchStatus === DispatchStatus.PENDING
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : formData.dispatchStatus === DispatchStatus.DISPATCHED
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {formData.dispatchStatus || DispatchStatus.PENDING}
              </Badge>
            )}
          </div>

          <div>
            <Label className="text-gray-600">Sales Invoice Number</Label>
            {isEditingPayment ? (
              <Input
                name="salesInvoiceNumber"
                value={formData.salesInvoiceNumber || ""}
                onChange={handleChange}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 font-medium">
                {formData.salesInvoiceNumber || "Not Generated"}
              </p>
            )}
          </div>

          <div>
            <Label className="text-gray-600">Invoice Date</Label>
            {isEditingPayment ? (
              <DatePicker
                value={
                  formData.invoiceDate
                    ? new Date(formData.invoiceDate)
                    : undefined
                }
                onChange={handleDateChange("invoiceDate")}
                // className="w-full"
                disableAfterDate={new Date()}
              />
            ) : (
              <p className="mt-1 font-medium">
                {formData.invoiceDate
                  ? format(new Date(formData.invoiceDate), "MMMM d, yyyy")
                  : "Not set"}
              </p>
            )}
          </div>

          <div>
            <Label className="text-gray-600">Actual Dispatch Date</Label>
            {isEditingPayment ? (
              <DatePicker
                value={
                  formData.actualDispatchDate
                    ? new Date(formData.actualDispatchDate)
                    : undefined
                }
                onChange={handleDateChange("actualDispatchDate")}
                // className="w-full"
                disableAfterDate={new Date()}
              />
            ) : (
              <p className="mt-1 font-medium">
                {formData.actualDispatchDate
                  ? format(
                      new Date(formData.actualDispatchDate),
                      "MMMM d, yyyy"
                    )
                  : "Not Dispatched"}
              </p>
            )}
          </div>

          <div className="col-span-3">
            <Label className="text-gray-600">Comments</Label>
            {isEditingPayment ? (
              <Textarea
                name="comments"
                value={formData.comments || ""}
                onChange={handleChange}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 font-medium">
                {formData.comments || "No comments"}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Section 3: Production Details */}
      <Card className="p-6 border border-gray-300 shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Machine & Production Details</h2>

        {formData.salesOrderDetails.map((detail, index) => (
          <div key={index} className="space-y-6 mb-8">
            <Separator className="border" />
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Machine Order #{index + 1}</h3>
              {editingProductionIndex !== index && formData.orderStatus === "OPEN" && (
                <PenBox
                  className="h-6 w-6 text-blue-900 cursor-pointer"
                  onClick={() => handleEditing("production", index)}
                />
              )}
              {editingProductionIndex === index && (
                <div className="space-x-2">
                  <Button size="sm" onClick={() => handleSave("production")}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleCancelEdit("production")}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-6">
              <div>
                <Label className="text-gray-600">Machine Model</Label>
                <p className="mt-1 font-medium">
                  {detail.machineModel.machineModelName}
                </p>
              </div>
              <div>
                <Label className="text-gray-600">Machine Type</Label>
                <p className="mt-1 font-medium">
                  {detail.machineType.machineTypeName}
                </p>
              </div>
              <div>
                <Label className="text-gray-600">Power Rating</Label>
                <p className="mt-1 font-medium">
                  {detail.powerRating.powerRating}
                </p>
              </div>
              <div>
                <Label className="text-gray-600">Sales Person</Label>
                <p className="mt-1 font-medium">
                  {detail.salesPerson.salesPersonName}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Production Details</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-gray-600">Production Order Code</Label>
                  <p className="mt-1 font-medium">
                    {detail.productionDetails.productionOrderCode}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600">Current Progress</Label>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${detail.productionDetails.currentProgress}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 mt-1">
                    {detail.productionDetails.currentProgress}%
                  </span>
                </div>

                <div>
                  <Label className="text-gray-600">Planned Start Date</Label>
                  {editingProductionIndex === index ? (
                    <DatePicker
                      value={
                        detail.productionDetails.plannedStartDate
                          ? new Date(detail.productionDetails.plannedStartDate)
                          : undefined
                      }
                      onChange={(date) =>
                        handleProductionDateChange(index, "plannedStartDate", date)
                      }
                      disableAfterDate={new Date("9999-12-31")}
                    />
                  ) : (
                    <p className="mt-1 font-medium">
                      {detail.productionDetails.plannedStartDate
                        ? format(
                            new Date(detail.productionDetails.plannedStartDate),
                            "MMMM d, yyyy"
                          )
                        : "Not set"}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-600">Actual Start Date</Label>
                  {editingProductionIndex === index ? (
                    <DatePicker
                      value={
                        detail.productionDetails.actualStartDate
                          ? new Date(detail.productionDetails.actualStartDate)
                          : undefined
                      }
                      onChange={(date) =>
                        handleProductionDateChange(index, "actualStartDate", date)
                      }
                      disableAfterDate={new Date("9999-12-31")}
                    />
                  ) : (
                    <p className="mt-1 font-medium">
                      {detail.productionDetails.actualStartDate
                        ? format(
                            new Date(detail.productionDetails.actualStartDate),
                            "MMMM d, yyyy"
                          )
                        : "Not started"}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-600">
                    Estimated Completion Date
                  </Label>
                  {editingProductionIndex === index ? (
                    <DatePicker
                      value={
                        detail.productionDetails.estimatedCompletionDate
                          ? new Date(
                              detail.productionDetails.estimatedCompletionDate
                            )
                          : undefined
                      }
                      onChange={(date) =>
                        handleProductionDateChange(
                          index,
                          "estimatedCompletionDate",
                          date
                        )
                      }
                      disableAfterDate={new Date("9999-12-31")}
                    />
                  ) : (
                    <p className="mt-1 font-medium">
                      {detail.productionDetails.estimatedCompletionDate
                        ? format(
                            new Date(
                              detail.productionDetails.estimatedCompletionDate
                            ),
                            "MMMM d, yyyy"
                          )
                        : "Not set"}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-600">Actual Completion Date</Label>
                    <p className="mt-1 font-medium">
                      {detail.productionDetails.actualCompletionDate
                        ? format(
                            new Date(
                              detail.productionDetails.actualCompletionDate
                            ),
                            "MMMM d, yyyy"
                          )
                        : "Not completed"}
                    </p>
                </div>

                <div className="col-span-2">
                  <Label className="text-gray-600">Comments</Label>
                  {editingProductionIndex === index ? (
                    <Textarea
                      name="comments"
                      value={detail.productionDetails.comments || ""}
                      onChange={(e) => handleProductionCommentChange(index, e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 font-medium">
                      {detail.productionDetails.comments || "No comments"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Card>

      {formData.orderStatus === "OPEN" && (
        <div className="flex justify-end space-x-2">
          <Button onClick={() => closeOrCancelSalesOrder("CLOSED")}>CLOSE SALES ORDER</Button>
          <Button variant="destructive" onClick={() => closeOrCancelSalesOrder("CANCELLED")}>CANCEL SALES ORDER</Button>
        </div>
      )}
    </div>
    </>
  );
}
