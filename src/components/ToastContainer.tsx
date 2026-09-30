import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border text-sm transition-all duration-300 transform translate-y-0 ${
              isSuccess 
                ? 'bg-slate-900 text-white border-emerald-500/30' 
                : isError
                ? 'bg-red-950 text-red-100 border-red-800'
                : isWarning
                ? 'bg-amber-950 text-amber-100 border-amber-800'
                : 'bg-slate-900 text-slate-100 border-slate-700'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
            {isWarning && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
            {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />}

            <div className="flex-1 pr-2">
              <p className="font-medium leading-relaxed">{toast.message}</p>
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white hover:bg-white/10 active:bg-white/20 p-1.5 rounded-lg transition-all duration-150 cursor-pointer active:scale-90"
              aria-label="Close notification"
              title="Dismiss (বন্ধ করুন)"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
