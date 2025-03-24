import { Button } from "@/components/ui/button";

interface NameTagProps {
  name: string;
  url?: string;
  onRemove: () => void;
}

export default function NameTag({ name, url, onRemove }: NameTagProps) {
  return (
    <div className="bg-slate-100 px-3 py-1.5 rounded-full flex items-center gap-2">
      {url ? (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
        >
          <span>{name}</span>
          <i className="fas fa-external-link-alt text-xs ml-1"></i>
        </a>
      ) : (
        <span className="text-gray-800">{name}</span>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="text-gray-500 hover:text-red-500 transition-colors"
      >
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
}
