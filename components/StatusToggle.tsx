"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface StatusToggleProps {
  isActive: boolean;
  onToggle: () => void;
  isLoading?: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

export default function StatusToggle({
  isActive,
  onToggle,
  isLoading = false,
  activeLabel = "Active",
  inactiveLabel = "Inactive",
}: StatusToggleProps) {
  return (
    <button
      onClick={onToggle}
      disabled={isLoading}
      className={`
        relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        ${isActive ? "bg-primary" : "bg-input"}
        ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      aria-label={isActive ? activeLabel : inactiveLabel}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-background shadow-lg transition-transform pointer-events-none items-center justify-center flex
          ${isActive ? "translate-x-6" : "translate-x-1"}
        `}
      >
        {isLoading && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
      </span>
    </button>
  );
}
