"use client";

import React from "react";
import { Search, Bell, Menu } from "lucide-react";
import { useUIStore } from "@/store/uiStore";

type HeaderProps = {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

const Header: React.FC<HeaderProps> = ({
  searchValue = "",
  onSearchChange,
}) => {
  const { toggleSidebar } = useUIStore();

  return (
    <header className="sticky top-0 z-30 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border h-16 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 mr-2 -ml-2 rounded-md hover:bg-muted text-muted-foreground md:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className="relative hidden md:flex items-center w-full max-w-sm">
          <Search size={16} className="absolute left-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full bg-muted/50 border-none rounded-md pl-9 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-muted-foreground transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button className="relative p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-background" />
        </button>
      </div>
    </header>
  );
};

export default Header;
