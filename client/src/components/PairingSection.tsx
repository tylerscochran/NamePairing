import { Button } from "@/components/ui/button";
import { Person } from "@shared/schema";
import { Download, Users2 } from "lucide-react";

// Helper function to convert pairs to HTML format
const convertToHTML = (pairs: Person[][]): string => {
  // HTML header with basic styling
  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Pairs</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
      background-color: #1f2937;
      color: #e5e7eb;
    }
    h1 {
      color: #60a5fa;
      margin-bottom: 20px;
    }
    p {
      margin: 12px 0;
    }
    a {
      color: #60a5fa;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    a:focus {
      outline: 2px solid #60a5fa;
      outline-offset: 2px;
      border-radius: 2px;
    }
    .skip-link {
      position: absolute;
      top: -40px;
      left: 0;
      background: #60a5fa;
      color: white;
      padding: 8px;
      z-index: 100;
    }
    .skip-link:focus {
      top: 0;
    }
    .pairing-list {
      margin-top: 20px;
    }
    @media (prefers-color-scheme: light) {
      body {
        background-color: #f9fafb;
        color: #1f2937;
      }
      h1 {
        color: #2563eb;
      }
      a {
        color: #2563eb;
      }
    }
  </style>
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <header>
    <h1>Generated Pairs</h1>
  </header>
  <main id="main-content">
    <div class="pairing-list" role="list">
`;
  
  // Generate HTML content for each pair - without titles
  pairs.forEach((pair, index) => {
    if (pair.length >= 2) {
      const person = pair[0];
      const pairedWith = pair[1];
      const url = pairedWith.url || "#"; // Use the paired person's URL
      
      // Create the HTML entry with accessibility attributes
      html += `      <div role="listitem">
        <p><a href="${url}" aria-label="${person.name} paired with ${pairedWith.name}">${person.name}</a></p>
      </div>\n`;
    } else if (pair.length === 1) {
      // For single person (no partner)
      html += `      <div role="listitem">
        <p>Solo: ${pair[0].name}</p>
      </div>\n`;
    }
  });
  
  // Close HTML tags
  html += `    </div>
  </main>
  <footer>
    <p>Generated on ${new Date().toLocaleDateString()}</p>
  </footer>
</body>
</html>`;
  
  return html;
};

// Helper function to download HTML
const downloadHTML = (pairs: Person[][]): void => {
  const htmlContent = convertToHTML(pairs);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'person_pairs.html');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

interface PairingSectionProps {
  persons: Person[];
  pairs: Person[][];
  pairsGenerated: boolean;
}

export default function PairingSection({
  persons,
  pairs,
  pairsGenerated,
}: PairingSectionProps) {
  return (
    <section 
      className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700"
      aria-labelledby="pairing-section-heading"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 id="pairing-section-heading" className="text-xl font-medium text-gray-100">Generated Pairs</h2>
          <p className="text-gray-300 text-sm">Names and URLs will be randomly paired when you generate</p>
        </div>
        <div className="flex gap-3">
          {pairsGenerated && (
            <Button
              onClick={() => downloadHTML(pairs)}
              variant="outline"
              className="border-gray-600 text-gray-200 hover:bg-gray-700 bg-gray-800"
              aria-label="Export generated pairs as HTML file"
              type="button"
            >
              <Download className="h-4 w-4 mr-2" aria-hidden="true" />
              Export HTML
            </Button>
          )}
        </div>
      </div>

      {/* Initial State - No Pairs */}
      {!pairsGenerated && (
        <div 
          className="text-center py-12 border-2 border-dashed border-gray-600 rounded-lg"
          role="region"
          aria-labelledby="no-pairs-heading"
        >
          <div className="text-gray-400 mb-2">
            <Users2 className="h-12 w-12 mx-auto text-gray-500" aria-hidden="true" />
          </div>
          <h3 id="no-pairs-heading" className="text-lg font-medium text-gray-300 mb-1">No pairs generated yet</h3>
          <p className="text-gray-400 text-sm">
            Import data above and click "Generate Pairs" to create random pairs
          </p>
        </div>
      )}

      {/* Pairs Generated Confirmation */}
      {pairsGenerated && (
        <div 
          className="text-center py-12 border-2 border-dashed border-gray-600 rounded-lg bg-gray-700"
          role="region"
          aria-live="polite"
          aria-labelledby="pairs-generated-heading"
        >
          <div className="text-gray-300 mb-2 text-green-400">
            <Users2 className="h-12 w-12 mx-auto text-green-400" aria-hidden="true" />
          </div>
          <h3 id="pairs-generated-heading" className="text-lg font-medium text-gray-200 mb-1">
            Pairs generated successfully!
          </h3>
          <p className="text-gray-300 text-sm mb-4">
            {pairs.length} {pairs.length === 1 ? 'pair has' : 'pairs have'} been created. Click the "Export HTML" button to download.
          </p>
          <Button
            onClick={() => downloadHTML(pairs)}
            variant="default"
            className="bg-green-600 text-white hover:bg-green-700"
            aria-label="Download generated pairs as HTML file"
            type="button"
          >
            <Download className="h-4 w-4 mr-2" aria-hidden="true" />
            Download HTML
          </Button>
        </div>
      )}
    </section>
  );
}
