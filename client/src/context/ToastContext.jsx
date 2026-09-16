/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext({ notify: () => {} });
export function ToastProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const notify = useCallback((message) => { const id = crypto.randomUUID(); setMessages((m) => [...m, { id, message }]); setTimeout(() => setMessages((m) => m.filter((item) => item.id !== id)), 4000); }, []);
  return <ToastContext value={{ notify }}>{children}<div className="toast-region" aria-live="polite">{messages.map((m) => <div className="toast" key={m.id}>{m.message}</div>)}</div></ToastContext>;
}
export const useToast = () => useContext(ToastContext);
