import { type FC, useEffect } from "react";
import { useFS } from "../state/fsContext";
import { TOAST_DURATION } from "../constants";

export const Toasts: FC = () => {
  const { state, dispatch } = useFS();

  useEffect(() => {
    const timers = state.toasts.map((toast) => {
      return setTimeout(() => {
        dispatch({ type: "REMOVE_TOAST", payload: { toastId: toast.id } });
      }, TOAST_DURATION);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [state.toasts, dispatch]);

  const handleDismiss = (toastId: string) => {
    dispatch({ type: "REMOVE_TOAST", payload: { toastId } });
  };

  if (state.toasts.length === 0) {
    return null;
  }

  return (
    <div className="toasts-container">
      {state.toasts.map((toast) => (
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
