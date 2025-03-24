import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { parseBulkInput } from "@/lib/utils";

interface BulkAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNames: (names: string[]) => void;
}

export default function BulkAddModal({
  isOpen,
  onClose,
  onAddNames,
}: BulkAddModalProps) {
  const [bulkNames, setBulkNames] = useState("");

  const handleSubmit = () => {
    const parsedNames = parseBulkInput(bulkNames);
    onAddNames(parsedNames);
    setBulkNames("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Add Names</DialogTitle>
          <DialogDescription>
            Enter multiple names, one per line or separated by commas.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={bulkNames}
            onChange={(e) => setBulkNames(e.target.value)}
            placeholder="John Smith&#10;Jane Doe&#10;Mike Johnson"
            className="min-h-40"
          />
        </div>
        <DialogFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Add Names
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
