import React, { useEffect } from 'react';
import { useFS } from '../state/fsContext';

export const Toasts: React.FC = () => {
  const { state, dispatch } = useFS();

  useEffect(() => {
    // Auto-remove toasts after 4 seconds
    const timers = state.toasts.map(toast => {
      return setTimeout(() => {
        dispatch({ type: 'REMOVE_TOAST', payload: { toastId: toast.id } });
      }, 4000);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [state.toasts, dispatch]);

  const handleDismiss = (toastId: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: { toastId } });
  };

  if (state.toasts.length === 0) {
    return null;
  }

  return (
    <div className="toasts-container">
      {state.toasts.map(toast => (
        <div 
          key={toast.id} 
          className={`toast toast-${toast.type}`}
          role="alert"
        >
          <span className="toast-message">{toast.message}</span>
          <button 
            className="toast-close" 
            onClick={() => handleDismiss(toast.id)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};