// components/ui/AlertOutlet.jsx
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useAlert } from "./AlertContext";
import { Alert } from "./Alert";

// injeta CSS mínimo uma vez
function useInjectOnce() {
  useEffect(() => {
    const id = "ui-alert-base-css";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      .ui-alert-stack { display:flex; flex-direction:column; gap:8px; }
      .ui-alert-fixed { position:fixed; top:16px; right:16px; z-index:1080; width:min(420px, 92vw); }
    `;
    document.head.appendChild(style);
  }, []);
}

/**
 * Renderiza os alerts do escopo informado.
 * props:
 * - scope: string (default: "global")
 * - fixed: boolean (se true, vira um stack fixo no topo-direito)
 * - container: HTMLElement (default: document.body quando fixed=true)
 */
export function AlertOutlet({ scope = "global", fixed = true, container }) {
  useInjectOnce();
  const { alerts, remove } = useAlert();
  const list = Array.isArray(alerts) ? alerts.filter(a => a?.scope === scope) : [];

  const content = (
    <div className={`ui-alert-stack ${fixed ? "ui-alert-fixed" : ""}`}>
      {list.map(a => (
        <Alert
          key={a.id}
          type={a.type}
          heading={a.heading}
          onClose={() => remove(a.id)}
        >
          {a.message}
        </Alert>
      ))}
    </div>
  );

  if (fixed) {
    const mount = container ?? document.body;
    return createPortal(content, mount);
  }
  // inline (renderiza onde o Outlet está declarado)
  return content;
}
