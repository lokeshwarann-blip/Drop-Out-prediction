import React from 'react';
import { useApp } from '../context/AppContext';

export default function NotificationToast() {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#131b2e] text-white px-5 py-3.5 rounded-lg shadow-2xl border border-outline-variant flex items-center gap-3 max-w-md">
        <span className="material-symbols-outlined text-emerald-400 text-[22px]">
          check_circle
        </span>
        <div className="flex-1">
          <p className="font-body-sm text-sm font-medium text-white leading-snug">
            {toast.message}
          </p>
        </div>
      </div>
    </div>
  );
}
