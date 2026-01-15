"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Dashboard";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage = pathname === "/login";

  return (
    <>
      {!isAuthPage && <Sidebar />}

      <main
        className={`pb-20 bg-gray-50 min-h-screen ${
          isAuthPage ? "" : "ml-68"
        }`}
      >
        {children}
      </main>
    </>
  );
}
