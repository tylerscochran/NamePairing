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
import { Person } from "@shared/schema";

interface BulkAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPersons: (persons: Person[]) => void;
}

export default function BulkAddModal({
  isOpen,
  onClose,
  onAddPersons,
}: BulkAddModalProps) {
  const [bulkInput, setBulkInput] = useState("");
  
  const handleSubmit = () => {
    const parsedNames = parseBulkInput(bulkInput);
    // Convert names to Person objects
    const persons: Person[] = parsedNames.map(name => ({
      name: name.trim(),
      url: undefined
    }));
    onAddPersons(persons);
    setBulkInput("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Add Names</DialogTitle>
          <DialogDescription>
            Enter multiple names, one per line or separated by commas.
            URLs can be added later individually.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            placeholder="John Smith&#10;Jane Doe&#10;Mike Johnson"
            className="min-h-40"
          />
        </div>
        <DialogFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Add Names
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
