import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateProductionProgress } from "@/services/ProductionService";
import { Production } from "@/utils/types/production.types";

interface ProductionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productionData: Production;
  onUpdate: () => void;
}

export function ProductionDetailsModal({
  isOpen,
  onClose,
  productionData,
  onUpdate,
}: ProductionDetailsModalProps) {
  const [progress, setProgress] = React.useState(productionData?.currentProgress || 0);
  const [comments, setComments] = React.useState(productionData?.comments || "");
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      const response = await updateProductionProgress(productionData.productionId, {
        currentProgress: progress,
        comments: comments,
      });

      if (response.success) {
        toast.success(response.message);
        onUpdate(); // Call the update callback to refresh the list
        onClose(); // Close the modal after successful update
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Error saving changes");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Production Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Production Order Code</Label>
                  <p>{productionData?.productionOrderCode}</p>
                </div>
                <div>
                  <Label className="font-semibold">Sales Order Code</Label>
                  <p>{productionData?.salesOrderDetails?.salesOrder?.salesOrderCode}</p>
                </div>
                <div>
                  <Label className="font-semibold">Machine Model</Label>
                  <p>{productionData?.salesOrderDetails?.machineModel?.machineModelName}</p>
                </div>
                <div>
                  <Label className="font-semibold">Machine Type</Label>
                  <p>{productionData?.salesOrderDetails?.machineType?.machineTypeName}</p>
                </div>
                <div>
                  <Label className="font-semibold">Power Rating</Label>
                  <p>{productionData?.salesOrderDetails?.powerRating?.powerRating}</p>
                </div>
                <div>
                  <Label className="font-semibold">Make</Label>
                  <p>{productionData?.salesOrderDetails?.make?.makeName}</p>
                </div>
                <div>
                  <Label className="font-semibold">Created By</Label>
                  <p>{productionData?.creator?.username}</p>
                </div>
                <div>
                  <Label className="font-semibold">Created At</Label>
                  <p>{new Date(productionData?.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="col-span-2">
                  <Label className="font-semibold">Comments</Label>
                  <Textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Add your comments here..."
                    className="mt-2"
                  />
                </div>
                <div className="col-span-2">
                  <Label className="font-semibold">Current Progress</Label>
                  <div className="pt-2">
                    <Slider
                      value={[progress]}
                      onValueChange={(value) => setProgress(value[0])}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-sm text-right mt-1">{progress}%</p>
                  </div>
                </div>
                <div className="col-span-2 flex justify-end mt-4">
                  <Button 
                    onClick={handleSaveChanges} 
                    disabled={isSaving}
                    className="w-32"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
