// pages/CadastroAlunos/AlunoDetalhe.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IconPlus, IconArrowLeft, IconRefresh } from "@tabler/icons-react";
import { ModalCadastroAluno } from "./components/ModalCadastroAluno";
import { getDados } from "../../services/Gets";

// helpers
const parseDMY = (s) => {
  const [d, m, y] = String(s ?? "").split("/");
  if (!d || !m || !y) return null;
  const dt = new Date(+y, (+m || 1) - 1, +d || 1);
  return Number.isNaN(dt.getTime()) ? null : dt;
};
const calcAgeFromDMY = (s) => {
  const birth = parseDMY(s);
  if (!birth) return "";
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
};

export function AlunoDetalhe() {
  const { cpf } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [aluno, setAluno] = useState(state?.aluno ?? null);
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagamentoEmDia, setPagamentoEmDia] = useState("Atrasado");
  const [error, setError] = useState(null);

  // carrega/atualiza pelo CPF da rota
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const dados = await getDados("getAlunosCadastrados");
        const lista = (Array.isArray(dados) ? dados : [])
          .filter(a => a && a.cpf && a.cpf !== "Cpf");
        setAluno(lista.find(a => a.cpf === cpf) || null);

        const dadosPag = await getDados("getPagamentos");
        const listaPag = (Array.isArray(dadosPag) ? dadosPag : [])
          .filter(p => p && p.cpf && p.cpf !== "cpf");
        setPagamentos(listaPag.filter(p => p.cpf === cpf));
      } finally {
        setLoading(false);
      }
    })();
  }, [cpf]);

  useEffect(() => {
    if (!aluno) return;

    const now = new Date();
    const mesAtual = now.toLocaleString('pt-BR', { month: 'long' }).toLowerCase();
    const anoAtual = String(now.getFullYear());

    const normaliza = (s) => String(s ?? "").trim().toLowerCase();

    const emDia = pagamentos.some(p => {
      let mes = normaliza(p.mesPagamento ?? p.mesPago ?? p.mes);
      let ano = String(p.anoPagamento ?? p.anoPago ?? p.anosPagamento ?? p.ano ?? "");

      if (mes.includes("/")) {
        const [m, a] = mes.split("/");
        mes = normaliza(m);
        ano = String(a ?? "");
      }

      return mes === mesAtual && ano === anoAtual;
    });

    setPagamentoEmDia(emDia ? "Em dia" : "Atrasado");
  }, [aluno, pagamentos]);


  const idade = useMemo(() => {
    if (!aluno) return "";
    if (aluno.idade !== undefined && aluno.idade !== null && aluno.idade !== "")
      return aluno.idade;
    return calcAgeFromDMY(aluno.dataNascimento);
  }, [aluno]);

  const badgeClass = pagamentoEmDia === "Em dia" ? "badge bg-green-lt" : "badge bg-red-lt";

  const handleSubmit = (form) => {
    // atualiza tela localmente após salvar na modal
    setAluno(prev => ({
      ...prev,
      cpf: String(form.cpf ?? prev?.cpf ?? ""),
      nome: String(form.nome ?? prev?.nome ?? ""),
      dataNascimento: String(form.dataNascimento ?? prev?.dataNascimento ?? ""),
      idade: String(form.idade ?? prev?.idade ?? ""),
      tipolano: String(form.tipoPlano ?? prev?.tipoPlano ?? ""),
      situacaoPagamento: String(form.situacaoPagamento ?? prev?.situacaoPagamento ?? ""),
    }));
  };

  const formataData = (dateString) => {
    const date = new Date(dateString);
    const dd = date.getDate().toString().padStart(2, '0');
    const mm = date.getMonth() + 1; // Janeiro é 0
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`; 
  }

  const reload = async () => {
    setLoading(true);
    try {
      const dados = await getDados("getAlunosCadastrados");
      const lista = (Array.isArray(dados) ? dados : [])
        .filter(a => a && a.cpf && a.cpf !== "Cpf");
      setAluno(lista.find(a => a.cpf === cpf) || null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-body">
        <div className="card">
          <div className="card-body">
            <div className="skeleton-line mb-2" style={{ width: "60%" }} />
            <div className="skeleton-line" style={{ width: "40%" }} />
          </div>
        </div>
      </div>
    );
  }

  if (!aluno) {
    return (
      <div className="page-body">
        <div className="alert alert-warning mb-3">Aluno não encontrado.</div>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          <IconArrowLeft size={18} className="me-1" /> Voltar
        </button>
      </div>
    );
  }

  return (
    <>
      {/* HEADER */}
      <div className="page-header">
        <div className="row align-items-center">
          <div className="col">
            <div className="d-flex align-items-center gap-2 mb-2">
              <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                <IconArrowLeft size={18} className="me-1" /> Voltar
              </button>
              <button className="btn btn-outline-secondary" onClick={reload} title="Recarregar">
                <IconRefresh size={18} className="me-1" /> Recarregar
              </button>
            </div>
            <h2 className="page-title mb-0">{aluno.nome}</h2>
            <div className="text-secondary">CPF: {aluno.cpf}</div>
          </div>

          <div className="col-auto ms-auto btn-list">
            <button
              className="btn btn-primary d-none d-sm-inline-block"
              data-bs-toggle="modal"
              data-bs-target="#modal-cadastro-aluno"
              type="button"
            >
              <IconPlus size={18} className="me-1" />
              Atualizar informações
            </button>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="page-body">
        <div className="row g-3">
          {/* Dados pessoais */}
          <div className="col-12 col-lg-6">
            <div className="card h-100">
              <div className="card-header">
                <h3 className="card-title">Dados pessoais</h3>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <div className="text-secondary">Data de nascimento</div>
                    <div>{formataData(aluno.dataNascimento) || "—"}</div>
                  </div>
                  <div className="col-12 col-md-3">
                    <div className="text-secondary">Idade</div>
                    <div>{idade || "—"}</div>
                  </div>
                  <div className="col-12 col-md-3">
                    <div className="text-secondary">CPF</div>
                    <div>{aluno.cpf}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Plano & Pagamento */}
          <div className="col-12 col-lg-6">
            <div className="card h-100">
              <div className="card-header">
                <h3 className="card-title">Plano & Pagamento</h3>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <div className="text-secondary">Plano</div>
                    <div>{aluno.tipoPlano || "—"}</div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="text-secondary">Situação</div>
                    <span className={badgeClass}>
                      {pagamentoEmDia || "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* espaço pra mais cards: histórico, próximos pagamentos, etc. */}
        </div>
      </div>

      {/* MODAL em modo edição, pré-preenchida */}
      <ModalCadastroAluno
        id="modal-cadastro-aluno"
        initialData={aluno}
        mode="edit"
        onSubmit={handleSubmit}
      />
    </>
  );
}
