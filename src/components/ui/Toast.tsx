import React from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

// Custom toast configurations
export const showToast = {
  success: (message: string, options?: any) => {
    toast.success(message, {
      duration: 3000,
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      style: {
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        color: '#166534',
      },
      ...options,
    });
  },

  error: (message: string, action?: { label: string; onClick: () => void }, options?: any) => {
    toast.error(message, {
      duration: 5000,
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      style: {
        background: '#fef2f2',
        border: '1px solid #fecaca',
        color: '#dc2626',
      },
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
      ...options,
    });
  },

  warning: (message: string, options?: any) => {
    toast(message, {
      duration: 4000,
      icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
      style: {
        background: '#fffbeb',
        border: '1px solid #fed7aa',
        color: '#d97706',
      },
      ...options,
    });
  },

  info: (message: string, options?: any) => {
    toast(message, {
      duration: 3000,
      icon: <Info className="w-5 h-5 text-blue-500" />,
      style: {
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        color: '#2563eb',
      },
      ...options,
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      style: {
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        color: '#475569',
      },
    });
  },

  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },
};

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: '',
        duration: 3000,
        style: {
          background: '#ffffff',
          color: '#1f2937',
          fontSize: '14px',
          fontWeight: '500',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          maxWidth: '400px',
        },
      }}
    />
  );
}