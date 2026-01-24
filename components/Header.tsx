"use client";

import React from "react";
import { Search, Plus, Bell } from "lucide-react";

type HeaderProps = {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

const Header: React.FC<HeaderProps> = ({
  searchValue = "",
  onSearchChange,
}) => {
  return (
    <header className="w-full h-16 bg-white  flex items-center justify-between px-4 md:px-6">
      {/* Left: Search */}
      <div className="flex items-center w-full max-w-md bg-gray-100 rounded-lg px-3 py-2">
        <Search size={18} className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search here..."
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4 ml-4">
        <button className="h-9 w-9 flex items-center justify-center rounded-lg bg-blue-600">
          <Plus size={18} className="text-white" />
        </button>

        <button className="relative h-9 w-9 flex items-center justify-center rounded-lg bg-gray-100">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
          HM
        </div>
      </div>
    </header>
  );
};

export default Header;
