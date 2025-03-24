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
import { Person } from "@shared/schema";

interface NameInputProps {
  persons: Person[];
  onAddPerson: (person: Person) => boolean;
  onRemovePerson: (person: Person) => void;
  onClearPersons: () => void;
  onBulkAdd: () => void;
}

export default function NameInput({
  persons,
  onAddPerson,
  onRemovePerson,
  onClearPersons,
  onBulkAdd,
}: NameInputProps) {
  const [currentName, setCurrentName] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [nameError, setNameError] = useState("");
  const [urlError, setUrlError] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPerson();
  };

  const addPerson = () => {
    const trimmedName = currentName.trim();
    const trimmedUrl = currentUrl.trim();
    
    let isValid = true;
    
    // Validate name
    if (!validateName(trimmedName)) {
      setNameError("Please enter a valid name");
      isValid = false;
    }
    
    // Validate URL (if provided)
    if (trimmedUrl && !trimmedUrl.match(/^https?:\/\/.*$/)) {
      setUrlError("Please enter a valid URL starting with http:// or https://");
      isValid = false;
    }
    
    if (isValid) {
      const newPerson: Person = {
        name: trimmedName,
        url: trimmedUrl || undefined
      };
      
      const success = onAddPerson(newPerson);
      if (success) {
        setCurrentName("");
        setCurrentUrl("");
        setNameError("");
        setUrlError("");
      }
    }
  };

  const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentName(e.target.value);
    if (nameError && validateName(e.target.value.trim())) {
      setNameError("");
    }
  };
  
  const handleUrlInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentUrl(e.target.value);
    if (urlError && (!e.target.value.trim() || e.target.value.trim().match(/^https?:\/\/.*$/))) {
      setUrlError("");
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-medium text-gray-800 mb-4">Add Names with URLs</h2>
      
      {/* Name and URL Input Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex flex-col gap-3">
          {/* Name Input */}
          <div className="flex-grow relative">
            <label htmlFor="name-input" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <Input
              id="name-input"
              type="text"
              value={currentName}
              onChange={handleNameInput}
              className="w-full px-4 py-3"
              placeholder="Enter a name"
            />
            {nameError && (
              <div className="text-red-500 text-sm mt-1">
                {nameError}
              </div>
            )}
          </div>
          
          {/* URL Input */}
          <div className="flex-grow relative">
            <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-1">
              URL (optional)
            </label>
            <Input
              id="url-input"
              type="text"
              value={currentUrl}
              onChange={handleUrlInput}
              className="w-full px-4 py-3"
              placeholder="https://example.com"
            />
            {urlError && (
              <div className="text-red-500 text-sm mt-1">
                {urlError}
              </div>
            )}
          </div>
          
          <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto">
            <i className="fas fa-plus mr-2"></i>
            Add Person
          </Button>
        </div>
      </form>

      {/* Name Tags Display */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {persons.map((person, index) => (
            <NameTag 
              key={`${person.name}-${index}`}
              name={person.name}
              url={person.url}
              onRemove={() => onRemovePerson(person)}
            />
          ))}
        </div>
      </div>

      {/* Counter and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-gray-600">
          <span>{persons.length}</span> entries added
        </div>
        <div className="flex gap-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="text-gray-700 bg-gray-100 hover:bg-gray-200"
                disabled={persons.length === 0}
              >
                <i className="fas fa-trash-alt mr-2"></i>
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will clear all entries from your list. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onClearPersons}>
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
