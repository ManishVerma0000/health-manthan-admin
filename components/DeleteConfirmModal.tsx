"use client";

import { Loader2, X } from "lucide-react";

interface Props {
  open: boolean;
  title?: string;
  description?: string;

  loading?: boolean;

  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  open,
  title = "Delete Item",
  description = "Are you sure you want to delete this item? This action cannot be undone.",

  loading = false,

  onClose,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      {/* Modal */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn">

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {title}
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          {description}
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-3">

          {/* Cancel */}
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          {/* Delete */}
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2 disabled:opacity-50"
          >
            {loading && (
              <Loader2
                size={16}
                className="animate-spin"
              />
            )}

            Delete
          </button>

        </div>
      </div>
    </div>
  );
}
