import { Button } from "@/components/ui/button";

// Helper function to convert pairs to CSV format
const convertToCSV = (pairs: string[][]): string => {
  const csvRows = [];
  
  // Add header row
  csvRows.push('Pair Number,Names');
  
  // Add data rows
  pairs.forEach((pair, index) => {
    csvRows.push(`${index + 1},"${pair.join(', ')}"`);
  });
  
  return csvRows.join('\n');
};

// Helper function to download CSV
const downloadCSV = (pairs: string[][]): void => {
  const csvContent = convertToCSV(pairs);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'name_pairs.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

interface PairingSectionProps {
  names: string[];
  pairs: string[][];
  pairsGenerated: boolean;
  onGeneratePairs: () => void;
}

export default function PairingSection({
  names,
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
          <p className="text-gray-600 text-sm">Names will be randomly paired when you generate</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={onGeneratePairs}
            variant="default"
            className="bg-blue-600 text-white hover:bg-blue-700"
            disabled={names.length === 0}
          >
            <i className="fas fa-random mr-2"></i>
            {pairsGenerated ? "Regenerate Pairs" : "Generate Pairs"}
          </Button>
          
          {pairsGenerated && (
            <Button
              onClick={() => downloadCSV(pairs)}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <i className="fas fa-download mr-2"></i>
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {/* Initial State - No Pairs */}
      {!pairsGenerated && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <div className="text-gray-400 mb-2">
            <i className="fas fa-users text-4xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-1">No pairs generated yet</h3>
          <p className="text-gray-500 text-sm">
            Add names above and click "Generate Pairs" to create random pairs
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
                <span className={`${pair.length === 1 ? 'bg-amber-500/10 text-amber-600' : 'bg-secondary/10 text-secondary'} text-xs px-2 py-1 rounded-full`}>
                  {pair.length === 1 ? 'Solo' : 'Team'}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {pair.map((name, nameIndex) => (
                  <div key={`${name}-${nameIndex}`} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${iconBgClasses[index % iconBgClasses.length][nameIndex % 2]} flex items-center justify-center`}>
                      <i className="fas fa-user"></i>
                    </div>
                    <span className="text-gray-800">{name}</span>
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
