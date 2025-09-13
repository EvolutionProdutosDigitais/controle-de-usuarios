// components/ui/AlertContext.jsx
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const AlertCtx = createContext(null);
export function useAlert() {
  const ctx = useContext(AlertCtx);
  if (!ctx) throw new Error("useAlert deve ser usado dentro de <AlertProvider/>");
  return ctx;
}

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]); // {id, type, heading, message, scope, timeoutMs}
  const timers = useRef(new Map());

  const remove = useCallback((id) => {
    setAlerts((arr) => arr.filter((a) => a.id !== id));
    const t = timers.current.get(id);
    if (t) {
      clearTimeout(t);
      timers.current.delete(id);
    }
  }, []);

  const clear = useCallback((scope) => {
    setAlerts((arr) => {
      const ids = arr.filter(a => !scope || a.scope === scope).map(a => a.id);
      ids.forEach(id => {
        const t = timers.current.get(id);
        if (t) clearTimeout(t);
        timers.current.delete(id);
      });
      return scope ? arr.filter(a => a.scope !== scope) : [];
    });
  }, []);

  const push = useCallback(({ type = "info", heading, message, scope = "global", timeoutMs = 4500 }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setAlerts((arr) => [...arr, { id, type, heading, message, scope, timeoutMs }]);
    if (timeoutMs) {
      const t = setTimeout(() => remove(id), timeoutMs);
      timers.current.set(id, t);
    }
    return id;
  }, [remove]);

  // açúcares
  const success = useCallback((message, opts = {}) => push({ type: "success", message, ...opts }), [push]);
  const info    = useCallback((message, opts = {}) => push({ type: "info", message, ...opts }), [push]);
  const warning = useCallback((message, opts = {}) => push({ type: "warning", message, ...opts }), [push]);
  const danger  = useCallback((message, opts = {}) => push({ type: "danger", message, ...opts }), [push]);

  const value = useMemo(() => ({
    alerts, push, remove, clear, success, info, warning, danger
  }), [alerts, push, remove, clear, success, info, warning, danger]);

  return <AlertCtx.Provider value={value}>{children}</AlertCtx.Provider>;
}
