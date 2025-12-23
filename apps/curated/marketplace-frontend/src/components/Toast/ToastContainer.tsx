/**
 * Toast container component
 * Task: T092 - Add toast notifications
 */

import React from 'react';
import { Toast, type ToastProps } from './Toast';
import './ToastContainer.css';

export interface ToastData {
  id: string;
  type: ToastProps['type'];
  message: string;
  duration?: number;
}

export interface ToastContainerProps {
  toasts: ToastData[];
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export function ToastContainer({ toasts, onClose, position = 'top-right' }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className={`toast-container toast-container-${position}`}>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onClose={onClose}
        />
      ))}
    </div>
  );
}
