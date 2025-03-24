import { Button } from "@/components/ui/button";
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
import { Person } from "@shared/schema";
import { UserPlus2, Upload, Trash2 } from "lucide-react";

interface NameInputProps {
  persons: Person[];
  onRemovePerson: (person: Person) => void;
  onClearPersons: () => void;
  onBulkAdd: () => void;
}

export default function NameInput({
  persons,
  onRemovePerson,
  onClearPersons,
  onBulkAdd,
}: NameInputProps) {
  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-xl font-medium text-gray-800 mb-1">Names List</h2>
          <p className="text-gray-600 text-sm">Import names and URLs from a CSV file</p>
        </div>
        <Button
          onClick={onBulkAdd}
          className="bg-blue-600 text-white hover:bg-blue-700 mt-3 sm:mt-0"
        >
          <Upload className="h-4 w-4 mr-2" />
          Import CSV
        </Button>
      </div>

      {/* Empty state */}
      {persons.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg mb-4">
          <div className="text-gray-400 mb-2">
            <Upload className="h-12 w-12 mx-auto text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-1">No data imported yet</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Click "Import CSV" to upload a CSV file with names and URLs
          </p>
        </div>
      )}

      {/* Name Tags Display */}
      {persons.length > 0 && (
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
      )}

      {/* Counter and Actions */}
      {persons.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <div className="text-gray-600">
            <span className="font-medium">{persons.length}</span> {persons.length === 1 ? 'person' : 'people'} imported
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="text-gray-700 bg-gray-100 hover:bg-gray-200"
                disabled={persons.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
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
        </div>
      )}
    </section>
  );
}
