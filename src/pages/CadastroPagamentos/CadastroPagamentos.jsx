// pages/CadastroAlunos.jsx
import React, { useMemo, useState, useEffect } from "react";
import { IconPlus } from "@tabler/icons-react";
import { ModalCadastroPagamentos } from "./components/ModalCadastroPagamentos";
import { Filtros } from "../../components/filtros/filtro";
import { getDados } from "../../services/Gets";

const MES_MAP = {
  "janeiro": 1, "fevereiro": 2, "março": 3, "marco": 3, "abril": 4, "maio": 5, "junho": 6,
  "julho": 7, "agosto": 8, "setembro": 9, "outubro": 10, "novembro": 11, "dezembro": 12
};

const parseDMY = (s = "") => {
  const [d, m, y] = s.split("/");
  const dd = +d || 1, mm = +m || 1, yy = +y || 0;
  return new Date(yy, mm - 1, dd).getTime();
};

export function CadastroPagamentos() {
  const [pesquisa, setPesquisa] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        let dados = await getDados("getPagamentos");
        dados = dados.filter(a => a && a.cpf != "cpf")
        const arr = Array.isArray(dados) ? dados : [];
        // mantém somente registros “reais”
        setPagamentos(
          arr.filter(p => p && typeof p === "object" )
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  const rows = useMemo(() => {
    const filtro = pesquisa.trim().toLowerCase();

    const filtrados = (pagamentos ?? []).filter(p => {
      const nome = (p?.nome ?? "").toLowerCase();
      const cpf = (p?.cpf ?? "");
      const mes = (p?.mesPagamento ?? "");
      const ano = String(p?.anosPagamento ?? "");
      const data = (p?.dataPagamento ?? "").toLowerCase();
      return (
        !filtro ||
        nome.includes(filtro) || cpf.includes(filtro) ||
        mes.includes(filtro) || ano.includes(filtro) ||
        data.includes(filtro)
      );
    });

    if (!sortConfig?.key) return filtrados;

    const dir = sortConfig.direction === "asc" ? 1 : -1;

    const sorted = [...filtrados].sort((a, b) => {
      const k = sortConfig.key;
      if (k === "dataPagamento") {
        return (parseDMY(a?.dataPagamento) - parseDMY(b?.dataPagamento)) * dir;
      }
      if (k === "anosPagamento") {
        return ((+a?.anosPagamento || 0) - (+b?.anosPagamento || 0)) * dir;
      }
      if (k === "mesPagamento") {
        const am = MES_MAP[(a?.mesPagamento ?? "").toLowerCase()] || 0;
        const bm = MES_MAP[(b?.mesPagamento ?? "").toLowerCase()] || 0;
        return (am - bm) * dir;
      }
      const av = String(a?.[k] ?? "").toLowerCase();
      const bv = String(b?.[k] ?? "").toLowerCase();
      return av.localeCompare(bv, "pt-BR") * dir;
    });

    return sorted;
  }, [pagamentos, pesquisa, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };


  return (
    <>
      <div className="page-header">
        <div className="row align-items-center">
          <div className="col">
            <h2 className="page-title">Cadastro de Pagamentos</h2>
          </div>
          <div className="col-auto ms-auto">
            <div className="btn-list">
              <button
                type="button"
                className="btn btn-primary d-none d-sm-inline-block"
                data-bs-toggle="modal"
                data-bs-target="#modal-cadastro-pagamentos"
              >
                <IconPlus size={20} className="me-1" />
                Cadastrar novo aluno
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filtro separado, mas controlado pelo pai */}
      <Filtros value={pesquisa} onChange={setPesquisa} onClear={() => setPesquisa("")} />

      <div className="page-body">
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-nowrap" role="button" onClick={() => handleSort("cpf")}>
                    CPF{" "}
                    {sortConfig.key === "cpf"
                      ? (sortConfig.direction === "asc" ? "↑" : "↓")
                      : "⇅"}
                  </th>
                  <th role="button" onClick={() => handleSort("nome")}>
                    Nome{" "}
                    {sortConfig.key === "nome"
                      ? (sortConfig.direction === "asc" ? "↑" : "↓")
                      : "⇅"}
                  </th>
                  <th className="text-nowrap" role="button" onClick={() => handleSort("dataPagamento")}>
                    Data de Pagamento{" "}
                    {sortConfig.key === "dataPagamento"
                      ? (sortConfig.direction === "asc" ? "↑" : "↓")
                      : "⇅"}
                  </th>
                  <th className="text-nowrap" role="button" onClick={() => handleSort("mesPagamento")}>
                    Mês Pago{" "}
                    {sortConfig.key === "mesPagamento"
                      ? (sortConfig.direction === "asc" ? "↑" : "↓")
                      : "⇅"}
                  </th>
                  <th className="text-nowrap" role="button" onClick={() => handleSort("anosPagamento")}>
                    Ano Pago{" "}
                    {sortConfig.key === "anosPagamento"
                      ? (sortConfig.direction === "asc" ? "↑" : "↓")
                      : "⇅"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows
                .map((a) => (
                  <tr key={`${a.cpf}-${a.dataPagamento}-${a.mesPagamento}-${a.anosPagamento}`}>
                    <td>{a.cpf}</td>
                    <td>{a.nome}</td>
                    <td>{a.dataPagamento}</td>
                    <td>{a.mesPagamento}</td>
                    <td>{a.anosPagamento}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-secondary">
                      Nenhum aluno encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ModalCadastroPagamentos />
    </>
  );
}
