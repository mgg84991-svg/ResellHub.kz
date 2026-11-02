import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-60 max-w-sm w-full animate-bounce-short">
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xl border border-slate-200 dark:border-slate-700">
        {icons[toast.type]}
        <div className="text-xs sm:text-sm font-semibold leading-snug">
          {toast.message}
        </div>
      </div>
    </div>
  );
};
