import { Button } from "@/components/ui/button";

interface NameTagProps {
  name: string;
  onRemove: () => void;
}

export default function NameTag({ name, onRemove }: NameTagProps) {
  return (
    <div className="bg-slate-100 px-3 py-1.5 rounded-full flex items-center gap-2">
      <span className="text-gray-800">{name}</span>
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
