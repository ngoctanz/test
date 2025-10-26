import { Search } from "lucide-react";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBox({
  value,
  onChange,
  placeholder = "Tìm kiếm...",
}: SearchBoxProps) {
  return (
    <div className="relative w-64">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 pl-10 pr-4 bg-black border border-[#3f9ced]/20 rounded text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3f9ced]/50 focus:border-[#3f9ced]/50 transition-all"
      />
    </div>
  );
}
