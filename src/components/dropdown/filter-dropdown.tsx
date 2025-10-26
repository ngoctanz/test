"use client";

import { useState } from "react";
import { FilterOption } from "@/utils/accounts.util";
import useClickOutSide from "@/hooks/useClickOutside";

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  icon?: string;
}

function FilterDropdown({
  label,
  options,
  value,
  onChange,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown when clicking outside
  const { nodeRef: dropdownRef } = useClickOutSide(() => {
    setIsOpen(false);
  });

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#0f1115] hover:bg-[#16171f] text-white text-sm border border-[#2a2d3a] hover:border-[#3a3d4a] focus:border-blue-500 rounded-lg px-4 py-2.5 focus:outline-none transition-all duration-200 flex items-center gap-2"
      >
        <span className="flex-1 text-left text-gray-300">
          {selectedOption?.label || label}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 text-gray-400 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-[#16171f] backdrop-blur-md border border-[#2a2d3a] rounded-lg shadow-2xl shadow-black/50 z-50 overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  option.value === value
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-[#2a2d3a] hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterDropdown;
