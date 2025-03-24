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
import { Person } from "@shared/schema";
import { Upload, Trash2 } from "lucide-react";

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
    <section className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-xl font-medium text-gray-100 mb-1">Names List</h2>
          <p className="text-gray-300 text-sm">Import names and URLs from a CSV file</p>
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
        <div className="text-center py-12 border-2 border-dashed border-gray-600 rounded-lg mb-4">
          <div className="text-gray-400 mb-2">
            <Upload className="h-12 w-12 mx-auto text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-1">No data imported yet</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Click "Import CSV" to upload a CSV file with names and URLs
          </p>
        </div>
      )}

      {/* Summary Display */}
      {persons.length > 0 && (
        <div className="py-8 px-6 rounded-lg bg-gray-700 border border-gray-600 text-center mb-4">
          <div className="text-4xl font-bold text-blue-400 mb-2">
            {persons.length}
          </div>
          <div className="text-lg text-blue-300">
            {persons.length === 1 ? 'Name' : 'Names'} Imported
          </div>
          <div className="text-sm text-blue-400 mt-1">
            Ready for pairing
          </div>
        </div>
      )}

      {/* Actions */}
      {persons.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <div className="text-gray-300">
            Data imported successfully. Click "Generate Pairs" below to create random pairs.
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="text-gray-200 bg-gray-700 hover:bg-gray-600 border-gray-600"
                disabled={persons.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-gray-800 border-gray-700 text-gray-100">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-gray-100">Are you sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-300">
                  This will clear all entries from your list. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onClearPersons} className="bg-red-600 text-white hover:bg-red-700">
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
