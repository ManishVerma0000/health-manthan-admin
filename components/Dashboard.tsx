"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  FileText,
  HospitalIcon,
  User,
  ClipboardList,
  MessageSquare,
  CalendarCheck,
  Landmark,
  ShieldCheck,
  ChevronRight,
  Scissors,
} from "lucide-react";
import GovernmentIcon from "./icons/GovernmentIcon";

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
    label: "Categories",
    href: "/category/list",
    icon: <FileText size={18} />,
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
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

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
      <aside
        className={`fixed top-0 left-0 h-screen z-50 bg-white  shadow-lg transition-all duration-300
        ${open ? "w-64" : "w-20"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            {open && <GovernmentIcon />}
          </div>

          {/* Collapse Button */}
          <button
            onClick={() => setOpen(!open)}
            className="hidden md:block bg-gray-100 p-2 rounded-lg hover:bg-gray-200"
          >
            <ChevronRight
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
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-lg
                transition-all hover:bg-gray-100
                ${open ? "text-gray-700" : "text-gray-600 justify-center"}
              `}
            >
              <span className="text-gray-500">{item.icon}</span>
              {open && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
