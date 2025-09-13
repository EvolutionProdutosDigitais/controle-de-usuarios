// components/ui/Alert.jsx
import React from "react";

export function Alert({ type = "info", heading, children, onClose }) {
  const icon = {
    success: (
      <svg xmlns="http://www.w3.org/2000/svg" className="icon alert-icon icon-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5l10 -10" /></svg>
    ),
    info: (
      <svg xmlns="http://www.w3.org/2000/svg" className="icon alert-icon icon-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>
    ),
    warning: (
      <svg xmlns="http://www.w3.org/2000/svg" className="icon alert-icon icon-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4" /><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" /><path d="M12 16h.01" /></svg>
    ),
    danger: (
      <svg xmlns="http://www.w3.org/2000/svg" className="icon alert-icon icon-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
    ),
  }[type] ?? null;

  return (
    <div className={`alert alert-${type} d-flex align-items-start`} role="alert" aria-live="polite">
      <div className="alert-icon" style={{ display: "inline-flex", alignItems: "center", marginRight: ".75rem" }}>
        {icon}
      </div>
      <div className="flex-grow-1">
        {heading ? <h4 className="alert-heading" style={{ marginBottom: ".25rem" }}>{heading}</h4> : null}
        <div className="alert-description" style={{ margin: 0, lineHeight: 1.4 }}>{children}</div>
      </div>
      <button type="button" className="btn-close ms-2" aria-label="Fechar alerta" onClick={onClose} />
    </div>
  );
}
