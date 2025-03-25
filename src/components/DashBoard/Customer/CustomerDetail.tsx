import { CustomerData } from "@/types/customer.type";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CustomerDetailModalProps {
    customer: CustomerData | null;
    onClose: () => void;
}

export default function CustomerDetail({ customer, onClose }: CustomerDetailModalProps) {
    if (!customer) return null;

    return (
        <Dialog open={!!customer} onOpenChange={onClose}>
            <DialogContent className="max-w-lg sm:max-w-2xl p-6 rounded-lg shadow-lg">
               
                <DialogHeader className="border-b pb-1">
                    <DialogTitle className="text-2xl font-medium">Customer Details</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
   
                <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg">
                    <DetailRow label="Customer Name" value={customer.customerName} isRequired />
                    <DetailRow label="Customer Code" value={customer.customerCode} isRequired />
                    <DetailRow label="Street" value={customer.street!} />
                    <DetailRow label="City" value={customer.city!} />
                    <DetailRow label="State" value={customer.state!} />
                    <DetailRow label="Country" value={customer.country!} />
                    <DetailRow label="Pincode" value={customer.pincode!} />
                    <DetailRow label="Type" value={customer.customerType} />
                    <DetailRow label="Email" value={customer.customerEmail!} />
                    <DetailRow label="Phone" value={customer.customerPhone!} />
                    <DetailRow label="Currency" value={customer.currency!} />
                    <DetailRow label="Create Date" value={formatDate(customer.createdAt)} /> 
                    <DetailRow label="Remarks" value={customer.customerComments!} />
                </div>

                <DialogFooter className="border-t pt-3 flex justify-end">
                    <DialogClose asChild>
                        <Button className="px-4 py-2 text-sm">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function DetailRow({ label, value, isRequired = false }: { label: string; value?: string; isRequired?: boolean }) {
    return (
        <div className="flex flex-col">
            <span className="text-zinc-600 text-sm font-medium">{label} :</span>
            <span className="text-zinc-900 font-medium">{isRequired ? value : value || "..............."}</span>
        </div>
    );
}

function formatDate(dateString?: string): string {
    return dateString ? new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
    }) : "...............";
}

