"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  FileText,
  HospitalIcon,
  User,
  ClipboardList,
  MessageSquare,
  CalendarCheck,
  Landmark,
  ShieldCheck,
  Scissors,
  Stethoscope,
  LayoutDashboard,
} from "lucide-react";
import GovernmentIcon from "./icons/GovernmentIcon";
import { useUIStore } from "@/store/uiStore";

// -----------------------------
// TYPE
// -----------------------------

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

// -----------------------------
// MENU ITEMS
// -----------------------------

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard", // Assuming /dashboard is the home, though page.tsx is at root. Adjusting href to / as per typical nextjs app or keeping /dashboard if that is the intended route. Steps showed login redirects to /dashboard.
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: "Categories",
    href: "/category/list",
    icon: <FileText size={18} />,
  },
  {
    label: "TreatedBy",
    href: "/treated-by/list",
    icon: <Stethoscope size={18} />,
  },
  {
    label: "Surgery",
    href: "/surgery/list",
    icon: <Scissors size={18} />,
  },
  {
    label: "Hospitals",
    href: "/hospital/list",
    icon: <HospitalIcon size={18} />,
  },
  {
    label: "Doctors",
    href: "/doctor/list",
    icon: <User size={18} />,
  },
  {
    label: "Hospital Categories",
    href: "/hospital-category/list",
    icon: <HospitalIcon size={18} />,
  },
  {
    label: "Insurance",
    href: "/insurance-company/list",
    icon: <ShieldCheck size={18} />,
  },
  {
    label: "Government Panel",
    href: "/government-panel/list",
    icon: <Landmark size={18} />,
  },
  {
    label: "Cashless Panel",
    href: "/cashless-insurance/list",
    icon: <ClipboardList size={18} />,
  },
  {
    label: "Contact Us",
    href: "/contact-us",
    icon: <MessageSquare size={18} />,
  },
  {
    label: "Appointment",
    href: "/book-appointment",
    icon: <CalendarCheck size={18} />,
  },
];

// -----------------------------
// SIDEBAR COMPONENT
// -----------------------------

export default function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, closeSidebar, openSidebar } = useUIStore();

  // Close sidebar on mobile on navigation
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        closeSidebar();
      } else {
        openSidebar();
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Run once on mount

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen z-50 bg-background border-r border-border shadow-sm transition-transform duration-300 ease-in-out w-64
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-border">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <GovernmentIcon />
            <span className="text-primary">HealthManthan</span>
          </div>

          <button
            onClick={closeSidebar}
            className="md:hidden p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 768) closeSidebar();
                }}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / User Profile stub could go here */}
        <div className="p-4 border-t border-border mt-auto">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
              HM
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Admin User</span>
              <span className="text-xs text-muted-foreground">admin@health.com</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}