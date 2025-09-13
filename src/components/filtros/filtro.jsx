// components/filtros/Filtros.jsx
import React from "react";
import { IconX } from "@tabler/icons-react";

export function Filtros({ value, onChange, onClear, placeholder = "Pesquisar" }) {
  return (
    <div>
      <label className="form-label">Pesquisa rápida</label>
      <div className="input-group input-group-flat">
        <input
          type="search"
          className="form-control"
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          aria-label="Pesquisar alunos"
        />
        <span className="input-group-text">
          <button
            type="button"
            className="link-secondary btn p-0"
            title="Limpar"
            onClick={onClear}
            aria-label="Limpar pesquisa"
          >
            <IconX size={20} stroke={2} />
          </button>
        </span>
      </div>
    </div>
  );
}
