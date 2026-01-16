'use client';

import { useState } from 'react';

type StatusToggleProps = {
  initialValue?: boolean;
  onChange?: (value: boolean) => void;
};

export default function StatusToggle({
  initialValue = false,
  onChange,
}: StatusToggleProps) {
  const [enabled, setEnabled] = useState(initialValue);

  const handleToggle = async () => {
    const newValue = !enabled;
    setEnabled(newValue);
    onChange?.(newValue);
  };

  return (
    <button
      onClick={handleToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300
        ${enabled ? 'bg-blue-600' : 'bg-gray-300'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300
          ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );
}
