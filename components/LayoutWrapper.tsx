"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useUIStore } from "@/store/uiStore";
import { useEffect, useState } from "react";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login";
  const { isSidebarOpen } = useUIStore();

  // Prevent hydration mismatch for sidebar state
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex min-h-screen bg-muted/30">
      {!isAuthPage && <Sidebar />}

      <main
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out min-h-screen ${!isAuthPage && mounted && isSidebarOpen ? "md:ml-64" : ""
          }`}
      >
        {children}
      </main>
    </div>
  );
}
