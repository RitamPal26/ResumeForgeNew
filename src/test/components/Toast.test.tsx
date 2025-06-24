import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { showToast, ToastProvider } from '../../components/ui/Toast';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
  Toaster: ({ children }: { children?: React.ReactNode }) => <div data-testid="toaster">{children}</div>,
}));

describe('Toast System', () => {
  it('renders ToastProvider', () => {
    render(<ToastProvider />);
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
  });

  it('calls toast.success with correct parameters', () => {
    const { toast } = require('react-hot-toast');
    
    showToast.success('Success message');
    
    expect(toast.success).toHaveBeenCalledWith('Success message', expect.objectContaining({
      duration: 3000,
      style: expect.objectContaining({
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        color: '#166534',
      }),
    }));
  });

  it('calls toast.error with action button', () => {
    const { toast } = require('react-hot-toast');
    const mockAction = { label: 'Retry', onClick: vi.fn() };
    
    showToast.error('Error message', mockAction);
    
    expect(toast.error).toHaveBeenCalledWith('Error message', expect.objectContaining({
      duration: 5000,
      action: mockAction,
      style: expect.objectContaining({
        background: '#fef2f2',
        border: '1px solid #fecaca',
        color: '#dc2626',
      }),
    }));
  });

  it('calls toast.warning with correct parameters', () => {
    const { toast } = require('react-hot-toast');
    
    showToast.warning('Warning message');
    
    expect(toast).toHaveBeenCalledWith('Warning message', expect.objectContaining({
      duration: 4000,
      style: expect.objectContaining({
        background: '#fffbeb',
        border: '1px solid #fed7aa',
        color: '#d97706',
      }),
    }));
  });

  it('calls toast.loading with correct parameters', () => {
    const { toast } = require('react-hot-toast');
    
    showToast.loading('Loading message');
    
    expect(toast.loading).toHaveBeenCalledWith('Loading message', expect.objectContaining({
      style: expect.objectContaining({
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        color: '#475569',
      }),
    }));
  });

  it('calls toast.dismiss', () => {
    const { toast } = require('react-hot-toast');
    
    showToast.dismiss('toast-id');
    
    expect(toast.dismiss).toHaveBeenCalledWith('toast-id');
  });
});