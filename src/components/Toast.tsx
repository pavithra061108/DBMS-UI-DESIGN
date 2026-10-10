import React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';

import { ToastMessage } from '../types/bank';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-4 bg-[#101827] border border-white/15 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-slideUp text-xs text-white"
        >
          {/* Notification Icon */}
          {toast.type === 'success' && (
            <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0 mt-0.5" />
          )}

          {toast.type === 'error' && (
            <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
          )}

          {toast.type === 'warning' && (
            <AlertTriangle className="w-5 h-5 text-[#FBBF24] shrink-0 mt-0.5" />
          )}

          {toast.type === 'info' && (
            <Info className="w-5 h-5 text-[#3B82F6] shrink-0 mt-0.5" />
          )}

          {/* Notification Content */}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white leading-tight">
              {toast.title}
            </p>

            <p className="text-[#CBD5E1]/70 text-[11px] mt-1 leading-relaxed">
              {toast.description}
            </p>
          </div>

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
            className="text-[#CBD5E1]/40 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;