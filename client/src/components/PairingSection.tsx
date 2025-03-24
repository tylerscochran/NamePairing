import { Button } from "@/components/ui/button";
import { Person } from "@shared/schema";
import { DownloadCloud, Shuffle, UserCircle2, Users2 } from "lucide-react";

// Helper function to convert pairs to CSV format
const convertToCSV = (pairs: Person[][]): string => {
  let csv = 'Pair Number,Person 1 Name,Person 1 URL,Person 2 Name,Person 2 URL\n';
  
  // Add data rows
  pairs.forEach((pair, index) => {
    const pairNumber = index + 1;
    const firstPersonName = pair.length > 0 ? pair[0].name : '';
    const firstPersonUrl = pair.length > 0 ? (pair[0].url || '') : '';
    const secondPersonName = pair.length > 1 ? pair[1].name : '';
    const secondPersonUrl = pair.length > 1 ? (pair[1].url || '') : '';
    
    // Escape fields with quotes if they contain commas
    const escapeCsv = (field: string) => {
      if (field.includes(',') || field.includes('"') || field.includes('\n')) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    };
    
    // Build CSV row
    csv += `${pairNumber},${escapeCsv(firstPersonName)},${escapeCsv(firstPersonUrl)},${escapeCsv(secondPersonName)},${escapeCsv(secondPersonUrl)}\n`;
  });
  
  return csv;
};

// Helper function to download CSV
const downloadCSV = (pairs: Person[][]): void => {
  const csvContent = convertToCSV(pairs);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'person_pairs.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

interface PairingSectionProps {
  persons: Person[];
  pairs: Person[][];
  pairsGenerated: boolean;
  onGeneratePairs: () => void;
}

export default function PairingSection({
  persons,
  pairs,
  pairsGenerated,
  onGeneratePairs,
}: PairingSectionProps) {
  // Define gradient classes for different pairs
  const gradientClasses = [
    'from-blue-50 to-indigo-50',
    'from-purple-50 to-pink-50',
    'from-teal-50 to-cyan-50',
    'from-amber-50 to-orange-50',
    'from-emerald-50 to-lime-50'
  ];
  
  const iconBgClasses = [
    ['bg-blue-100 text-blue-600', 'bg-indigo-100 text-indigo-600'],
    ['bg-purple-100 text-purple-600', 'bg-pink-100 text-pink-600'],
    ['bg-teal-100 text-teal-600', 'bg-cyan-100 text-cyan-600'],
    ['bg-amber-100 text-amber-600', 'bg-orange-100 text-orange-600'],
    ['bg-emerald-100 text-emerald-600', 'bg-lime-100 text-lime-600']
  ];

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-medium text-gray-800">Generated Pairs</h2>
          <p className="text-gray-600 text-sm">Names and URLs will be randomly paired when you generate</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={onGeneratePairs}
            variant="default"
            className="bg-blue-600 text-white hover:bg-blue-700"
            disabled={persons.length === 0}
          >
            <Shuffle className="h-4 w-4 mr-2" />
            {pairsGenerated ? "Regenerate Pairs" : "Generate Pairs"}
          </Button>
          
          {pairsGenerated && (
            <Button
              onClick={() => downloadCSV(pairs)}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <DownloadCloud className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {/* Initial State - No Pairs */}
      {!pairsGenerated && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <div className="text-gray-400 mb-2">
            <Users2 className="h-12 w-12 mx-auto text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-1">No pairs generated yet</h3>
          <p className="text-gray-500 text-sm">
            Import data above and click "Generate Pairs" to create random pairs
          </p>
        </div>
      )}

      {/* Generated Pairs */}
      {pairsGenerated && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pairs.map((pair, index) => (
            <div 
              key={index}
              className={`border border-gray-200 rounded-lg p-4 bg-gradient-to-r ${gradientClasses[index % gradientClasses.length]}`}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-800">
                  {pair.length === 1 ? 'Individual' : `Pair ${index + 1}`}
                </h3>
                <span className={`${pair.length === 1 ? 'bg-amber-500/10 text-amber-600' : 'bg-blue-500/10 text-blue-600'} text-xs px-2 py-1 rounded-full flex items-center gap-1`}>
                  {pair.length === 1 ? (
                    <>
                      <UserCircle2 className="h-3 w-3" />
                      Solo
                    </>
                  ) : (
                    <>
                      <Users2 className="h-3 w-3" />
                      Team
                    </>
                  )}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {pair.map((person, nameIndex) => (
                  <div key={`${person.name}-${nameIndex}`} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${iconBgClasses[index % iconBgClasses.length][nameIndex % 2]} flex items-center justify-center`}>
                      <UserCircle2 className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-800">{person.name}</span>
                      {person.url && (
                        <a href={person.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline truncate max-w-[200px]">
                          {person.url}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
