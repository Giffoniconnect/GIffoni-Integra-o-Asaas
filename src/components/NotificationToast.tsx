import React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface NotificationToastProps {
  toasts: ToastMessage[];
  onRemoveToast: (id: string) => void;
}

export default function NotificationToast({ toasts, onRemoveToast }: NotificationToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3.5 max-w-sm w-full">
      {toasts.map((toast) => {
        const bgType = () => {
          switch (toast.type) {
            case 'success':
              return 'bg-white border-emerald-100 shadow-emerald-50 text-emerald-800';
            case 'error':
              return 'bg-white border-rose-100 shadow-rose-50 text-rose-800';
            case 'info':
            default:
              return 'bg-white border-indigo-100 shadow-indigo-50 text-indigo-800';
          }
        };

        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />;
            case 'error':
              return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
            case 'info':
            default:
              return <Info className="w-5 h-5 text-indigo-500 shrink-0" />;
          }
        };

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 animate-slide-in ${bgType()}`}
          >
            {getIcon()}
            <div className="flex-1 text-xs font-semibold leading-relaxed">
              {toast.message}
            </div>
            <button
              onClick={() => onRemoveToast(toast.id)}
              className="p-1 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-650 transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
