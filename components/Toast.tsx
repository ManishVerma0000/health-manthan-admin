"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  show: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = "success",
  show,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  const styles = {
    success: "border-green-500/50 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-200",
    error: "border-red-500/50 bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-200",
    info: "border-blue-500/50 bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-200",
  };

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />,
    error: <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />,
    info: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
  }

  return (
    <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-5 fade-in duration-300">
      <div
        className={`
            flex w-full max-w-sm items-center gap-3 rounded-lg border px-4 py-3 shadow-lg ring-1 ring-black/5
            ${styles[type]}
        `}
      >
        {icons[type]}
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="rounded-md p-1 opacity-60 hover:opacity-100 focus:opacity-100 transition-opacity"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
