"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ManualTriggerDialog = ({ onOpenChange, open }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manual Trigger</DialogTitle>
          <DialogDescription>Configure manual node settings</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>
            Manual workflow execution - cannot configure manual trigger node
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
