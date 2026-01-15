"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Users,
  Settings,
  ChevronDown,
  Menu,
  X,
  FileText,
  BarChart,
  LayoutDashboard,
  Hospital,
  HospitalIcon,
  User,
  Book,
  GroupIcon,
  GrabIcon,
  NotepadText,
} from "lucide-react";

// -----------------------------
// TYPE
// -----------------------------

type NavItem = {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
};

// -----------------------------
// MENU ITEMS
// -----------------------------

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: <Home size={18} />,
  },
  {
    label: "Categories",
    icon: <FileText size={18} />,
    children: [
      { label: "All Categories", href: "/category/list" },
      { label: "Create Category Post", href: "/category/add" },
    ],
  },
  {
    label: "Add Hospital",
    icon: <HospitalIcon size={18} />,
    children: [
      { label: "All Hospital", href: "/hospital/list" },
      { label: "Create Hospital", href: "/hospital/add" },
    ],
  },

  {
    label: "Add Doctors",
    icon: <User size={18} />,
    children: [
      { label: "All Doctors", href: "/doctor/list" },
      { label: "Create Doctor", href: "/doctor/add" },
    ],
  },

  {
    label: "Hospitals Categories",
    icon: <HospitalIcon size={18} />,
    children: [
      { label: "All Hospital Categories", href: "/hospital-category/list" },
      { label: "Create Doctor", href: "/hospital-category/add" },
    ],
  },
  {
    label: "Insurance",
    icon: <Book size={18} />,
    children: [
      { label: "All Insurance", href: "/insurance-company/list" },
      { label: "Create Insurance", href: "/insurance-company/add" },
    ],
  },
  {
    label: "Government Panel",
    icon: <GrabIcon size={18} />,
    children: [
      { label: "All Govt Panel", href: "/government-panel/list" },
      { label: "Create Govt Panel", href: "/government-panel/add" },
    ],
  },
  {
    label: "Cashless Insurance",
    icon: <NotepadText size={18} />,
    children: [
      { label: "All Cashless Insurance", href: "/cashless-insurance/list" },
      { label: "Create Cashless Insurance", href: "/cashless-insurance/add" },
    ],
  },
  {
    label: "Contact Us",
    icon: <NotepadText size={18} />,
    children: [{ label: "All ContactUS Records", href: "/contact-us" }],
  },

  {
    label: "Appointment",
    icon: <NotepadText size={18} />,
    children: [{ label: "All Appointment", href: "/book-appointment" }],
  },
];

// -----------------------------
// SIDEBAR COMPONENT
// -----------------------------

export default function Sidebar() {
  const [open, setOpen] = useState(true); // collapse state
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMenu = (label: string) => {
    setActiveMenu(activeMenu === label ? null : label);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow"
      >
        <Menu size={22} />
      </button>

      {/* Overlay (Mobile) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen z-50 bg-grey border-r-gray-600 shadow-lg transition-all duration-300
        ${open ? "w-64" : "w-20"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <LayoutDashboard size={20} />
            </div>
            {open && <h2 className="text-lg font-semibold">Health Manthan</h2>}
          </div>

          {/* Collapse Button */}
          <button
            onClick={() => setOpen(!open)}
            className="hidden md:block bg-gray-100 p-2 rounded-lg hover:bg-gray-200"
          >
            <ChevronDown
              size={20}
              className={`transition-transform ${
                open ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {/* Mobile Close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden bg-gray-100 p-2 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-3 space-y-2">
          {navItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = activeMenu === item.label;

            return (
              <div key={item.label}>
                {/* Parent Item */}
                <button
                  onClick={() => (hasChildren ? toggleMenu(item.label) : null)}
                  className={`
                    flex items-center justify-between w-full px-4 py-2.5 rounded-lg cursor-pointer 
                    transition-all hover:bg-gray-100
                    ${open ? "text-gray-700" : "text-gray-600"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">{item.icon}</span>
                    {open && <span>{item.label}</span>}
                  </div>

                  {hasChildren && open && (
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Dropdown Submenu */}
                {hasChildren && isOpen && open && (
                  <div className="ml-10 mt-1 space-y-1">
                    {item.children!.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className="block px-3 py-1.5 rounded-md text-sm text-gray-600 hover:bg-gray-200"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}
