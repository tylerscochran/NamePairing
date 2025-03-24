import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import NameTag from "./NameTag";
import { validateName } from "@/lib/utils";

interface NameInputProps {
  names: string[];
  onAddName: (name: string) => boolean;
  onRemoveName: (name: string) => void;
  onClearNames: () => void;
  onBulkAdd: () => void;
}

export default function NameInput({
  names,
  onAddName,
  onRemoveName,
  onClearNames,
  onBulkAdd,
}: NameInputProps) {
  const [currentName, setCurrentName] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addName();
  };

  const addName = () => {
    const trimmedName = currentName.trim();
    
    if (validateName(trimmedName)) {
      const success = onAddName(trimmedName);
      if (success) {
        setCurrentName("");
        setError("");
      }
    } else {
      setError("Please enter a valid name");
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentName(e.target.value);
    if (error && validateName(e.target.value.trim())) {
      setError("");
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-medium text-gray-800 mb-4">Add Names</h2>
      
      {/* Name Input Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-grow relative">
            <Input
              type="text"
              value={currentName}
              onChange={handleInput}
              className="w-full px-4 py-3"
              placeholder="Enter a name"
            />
            {error && (
              <div className="text-red-500 text-sm mt-1 absolute">
                {error}
              </div>
            )}
          </div>
          <Button type="submit" className="bg-primary hover:bg-blue-600">
            <i className="fas fa-plus mr-2"></i>
            Add Name
          </Button>
        </div>
      </form>

      {/* Name Tags Display */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {names.map((name, index) => (
            <NameTag 
              key={`${name}-${index}`}
              name={name}
              onRemove={() => onRemoveName(name)}
            />
          ))}
        </div>
      </div>

      {/* Counter and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-gray-600">
          <span>{names.length}</span> names added
        </div>
        <div className="flex gap-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="text-gray-700 bg-gray-100 hover:bg-gray-200"
                disabled={names.length === 0}
              >
                <i className="fas fa-trash-alt mr-2"></i>
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will clear all names from your list. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onClearNames}>
                  Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button
            variant="outline"
            className="text-gray-700 bg-gray-100 hover:bg-gray-200"
            onClick={onBulkAdd}
          >
            <i className="fas fa-list mr-2"></i>
            Bulk Add
          </Button>
        </div>
      </div>
    </section>
  );
}
