// src/components/ui/use-toast.ts
import { useState } from 'react';

type Toast = {
  message: string;
  type: 'success' | 'error' | 'info';
};

export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const ToastComponent = () => {
    if (!toast) return null;

    const bgColor = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-blue-500',
    }[toast.type];

    return (
      <div className={`fixed top-4 right-4 text-white px-4 py-2 rounded-md ${bgColor}`}>
        {toast.message}
      </div>
    );
  };

  return { showToast, ToastComponent };
}