import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";               // ← IMPORTANTE
import { IconPlus } from "@tabler/icons-react";
import { ModalCadastroAluno } from "./components/ModalCadastroAluno";
import { Filtros } from "../../components/filtros/filtro";
import { getDados } from "../../services/Gets";

export function CadastroAlunos() {
  const navigate = useNavigate();
  const [pesquisa, setPesquisa] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [alunos, setAlunos] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [pagamentoEmDia, setPagamentoEmDia] = useState("Atrasado");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        let dados = await getDados("getAlunosCadastrados");
        dados = dados.filter(a => a && a.cpf !== 'Cpf')
        setAlunos(Array.isArray(dados) ? dados : []);

        let dadosPag = await getDados("getPagamentos");
        dadosPag = dadosPag
          .filter(p => p && p.cpf && p.cpf !== "cpf");
        setPagamentos(dadosPag);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const normaliza = (s) => String(s ?? "").trim().toLowerCase();

  const cpfsPagosMesAtual = useMemo(() => {
    if (!Array.isArray(pagamentos)) return new Set();

    const now = new Date();
    const mesAtual = now.toLocaleString("pt-BR", { month: "long" }).toLowerCase();
    const anoAtual = String(now.getFullYear());

    const set = new Set();

    for (const p of pagamentos) {
      if (!p?.cpf) continue;

      let mes = normaliza(p.mesPagamento ?? p.mesPago ?? p.mes);
      let ano = String(p.anoPagamento ?? p.anoPago ?? p.anosPagamento ?? p.ano ?? "");

      // Caso venha "Agosto/2025" em um único campo
      if (mes.includes("/")) {
        const [m, a] = mes.split("/");
        mes = normaliza(m);
        ano = String(a ?? "");
      }

      if (mes === mesAtual && ano === anoAtual) {
        set.add(p.cpf);
      }
    }

    return set;
  }, [pagamentos]);

  const stripAccents = (s) =>
    String(s ?? "").normalize ? String(s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "") : String(s ?? "");

  const isNaoPagante = (plano) =>
    stripAccents(normaliza(plano)) === "nao pagante";


  // Alunos com situação calculada para o mês atual
  const alunosDecorados = useMemo(() => {
    return (alunos ?? []).map(a => {
      const naoPagante = isNaoPagante(a?.tipoPlano);
      const emDia = naoPagante || cpfsPagosMesAtual.has(a.cpf);
      return {
        ...a,
        situacaoPagamento: emDia ? "Em dia" : "Atrasado",
      };
    });
  }, [alunos, cpfsPagosMesAtual]);


  // Rows: filtro + ordenação sobre a lista decorada
  const rows = useMemo(() => {
    const filtro = pesquisa.trim().toLowerCase();

    const filtrados = alunosDecorados.filter(a => {
      const nome = (a?.nome ?? "").toLowerCase();
      const cpf = (a?.cpf ?? "");
      const tipoPlano = (a?.tipoPlano ?? "").toLowerCase();
      const situ = (a?.situacaoPagamento ?? "").toLowerCase();
      return (
        !filtro ||
        nome.includes(filtro) ||
        cpf.includes(filtro) ||
        tipoPlano.includes(filtro) ||
        situ.includes(filtro)
      );
    });

    if (!sortConfig.key) return filtrados;

    const toTime = (s = "") => {
      const [d, m, y] = s.split("/");
      return new Date(+y || 0, (+m || 1) - 1, +d || 1).getTime();
    };

    return [...filtrados].sort((a, b) => {
      let av = a?.[sortConfig.key];
      let bv = b?.[sortConfig.key];

      if (sortConfig.key === "dataNascimento") {
        av = toTime(av);
        bv = toTime(bv);
      }

      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av ?? "").localeCompare(String(bv ?? ""), "pt-BR");

      return sortConfig.direction === "asc" ? cmp : -cmp;
    });
  }, [alunosDecorados, pesquisa, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleRowClick = (aluno) => {
    navigate(`/alunos/${encodeURIComponent(aluno.cpf)}`, { state: { aluno } });
  };

  return (
    <>
      <div className="page-header">
        <div className="row align-items-center">
          <div className="col"><h2 className="page-title">Cadastro de Alunos</h2></div>
          <div className="col-auto ms-auto">
            <div className="btn-list">
              <button
                type="button"
                className="btn btn-primary d-none d-sm-inline-block"
                data-bs-toggle="modal"
                data-bs-target="#modal-cadastro-aluno"
              >
                <IconPlus size={20} className="me-1" />
                Cadastrar novo aluno
              </button>
            </div>
          </div>
        </div>
      </div>

      <Filtros value={pesquisa} onChange={setPesquisa} onClear={() => setPesquisa("")} />

      <div className="page-body">
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-nowrap" role="button" onClick={() => handleSort("cpf")}>
                    CPF {sortConfig.key === "cpf" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "⇅"}
                  </th>
                  <th role="button" onClick={() => handleSort("nome")}>
                    Nome {sortConfig.key === "nome" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "⇅"}
                  </th>
                  <th className="text-nowrap" role="button" onClick={() => handleSort("dataNascimento")}>
                    Data Nascimento {sortConfig.key === "dataNascimento" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "⇅"}
                  </th>
                  <th className="text-nowrap" role="button" onClick={() => handleSort("idade")}>
                    Idade {sortConfig.key === "idade" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "⇅"}
                  </th>
                  <th className="text-nowrap" role="button" onClick={() => handleSort("tipoPlano")}>
                    Tipo de Plano {sortConfig.key === "tipoPlano" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "⇅"}
                  </th>
                  <th role="button" onClick={() => handleSort("situacaoPagamento")}>
                    Situação do pagamento {sortConfig.key === "situacaoPagamento" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "⇅"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows
                  .map((a) => (
                    <tr
                      key={a.cpf}
                      onClick={() => handleRowClick(a)}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleRowClick(a)}
                      tabIndex={0}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="text-table">{a.cpf}</td>
                      <td className="text-table">{a.nome}</td>
                      <td className="text-table">{a.dataNascimento}</td>
                      <td className="text-table">{a.idade}</td>
                      <td className="text-table">{a.tipoPlano}</td>
                      <td className="text-table">
                        <span className={a.situacaoPagamento === "Em dia" ? "status status-green" : "status status-red"}>
                          <span className="status-dot status-dot-animated"></span>
                          {a.situacaoPagamento}
                        </span>
                      </td>

                    </tr>
                  ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-secondary">Nenhum aluno encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ModalCadastroAluno />
    </>
  );
}
