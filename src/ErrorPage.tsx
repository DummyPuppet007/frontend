import { useRouteError } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function ErrorPage() {
  const error = useRouteError();
  const [open, setOpen] = useState(true);

  let errorMessage = "An unexpected error occurred.";
  if (error && typeof error === "object") {
    errorMessage = "statusText" in error 
      ? String(error.statusText)
      : "message" in error
      ? String(error.message)
      : errorMessage;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-600">Oops! Something went wrong.</DialogTitle>
          <DialogDescription className="text-gray-600">
            {errorMessage}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
          <Button variant="destructive" onClick={() => window.location.href = "/"}>Go Home</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ErrorPage;
