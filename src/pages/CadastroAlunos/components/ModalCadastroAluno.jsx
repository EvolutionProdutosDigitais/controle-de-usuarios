// components/ModalCadastroAluno.jsx
import React, { useEffect, useState } from "react";
import { IMaskInput } from "react-imask";
import { postCadastroAlunos } from "../../../services/Gets";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";
import { useAlert } from "../../../components/utils/ui/AlertContext";
import { AlertOutlet } from "../../../components/utils/ui/AlertOutlet";

const EMPTY = {
  cpf: "",
  nome: "",
  dataNascimento: "",
  idade: "",
  tipoPlano: "Mensal",
};

const toDateInput = (v) => {
  if (!v) return "";
  const d = new Date(v);
  // Corrige pelo fuso para não “voltar um dia”
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60000);
  return local.toISOString().slice(0, 10); // "YYYY-MM-DD"
};


export function ModalCadastroAluno({
  initialData = null,
  id = "modal-cadastro-aluno"
}) {
  const scope = id;
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const { success, info, warning, danger, clear } = useAlert();
  

  // quando abrir com dados (edição), preenche o formulário
  useEffect(() => {
    if (initialData) {
      setForm({
        cpf: initialData.cpf ?? "",
        nome: initialData.nome ?? "",
        dataNascimento: initialData.dataNascimento ?? "",
        idade: String(initialData.idade ?? ""),
        tipoPlano: initialData.tipoPlano ?? "Mensal",
        update: "Sim",
      });
      setForm(f => ({
        ...f,
        dataNascimento: toDateInput(initialData?.dataNascimento)
      }));

    } else {
      setForm(EMPTY);
    }
  }, [initialData]);

  const calcAgeFromYMD = (s) => {
    if (!s) return "";
    const [y, m, d] = String(s).split("-");
    if (!y || !m || !d) return "";
    const birth = new Date(+y, (+m || 1) - 1, +d || 1);
    if (Number.isNaN(birth.getTime())) return "";
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const mm = now.getMonth() - birth.getMonth();
    if (mm < 0 || (mm === 0 && now.getDate() < birth.getDate())) age--;
    return age;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dataNascimento") {
      const idade = calcAgeFromYMD(value);
      setForm((f) => ({ ...f, dataNascimento: value, idade }));
      return;
    }

    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async () => {
    clear(scope);

    if (form.cpf.length !== 14) {
      warning("Cpf Inválido. Verifique e tente novamente.", { scope: scope });
      return;
    }
    if (!form.nome?.trim()) {
      info("Informe o nome completo do aluno.", {scope: scope });
      return;
    }

    try {
      setSaving(true);
      const res = await postCadastroAlunos(form, form.update);

      if (!res) {
        danger("Ocorreu um problema ao enviar os dados. Tente novamente.", { scope: scope });
        return;
      }

      success("Os dados foram processados com sucesso.", {
        heading: form.update === "Sim" ? "Alterações salvas!" : "Aluno cadastrado!"
      });

      setTimeout(() => {
        const modal = document.getElementById(id);
        if (modal) {
          const instance = Modal.getInstance(modal) || new Modal(modal);
          instance.hide();
        }
      }, 600);

    } catch (err) {
      console.error(err);
      danger("Houve uma falha ao salvar. Verifique o console para detalhes.", { heading: "Erro inesperado", scope: scope });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal" id={id} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title" id={`${id}-title`}>
              {form.update === "Sim" ? "Atualizar aluno" : "Cadastrar novo aluno"}
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>

          <div className="modal-body">
             <AlertOutlet scope={scope} fixed={false} />
            {/* CPF e Nome */}
            <div className="mb-3">
              <label className="form-label">CPF</label>
              <IMaskInput
                mask="000.000.000-00"
                className="form-control form-control-rounded mb-2"
                placeholder="000.000.000-00"
                autoComplete="off"
                name="cpf"
                value={form.cpf}
                // IMask usa onAccept para atualização controlada
                onAccept={(val) => setForm((f) => ({ ...f, cpf: val }))}
              />

              <label className="form-label">Nome</label>
              <input
                type="text"
                className="form-control form-control-rounded"
                placeholder="Nome completo"
                autoComplete="off"
                name="nome"
                value={form.nome}
                onChange={handleChange}
              />
            </div>

            {/* Data de Nascimento + Idade */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Data de Nascimento</label>
                <input
                  type="date"
                  className="form-control form-control-rounded"
                  // placeholder="Nome completo"
                  autoComplete="off"
                  name="dataNascimento"
                  value={form.dataNascimento}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Idade</label>
                <input
                  type="number"
                  className="form-control form-control-rounded"
                  autoComplete="off"
                  name="idade"
                  value={form.idade}
                  disabled
                />
              </div>
            </div>

            {/* Tipo de Plano */}
            <div className="mb-3">
              <label className="form-label">Tipo de Plano</label>
              <select
                className="form-select form-control-rounded"
                name="tipoPlano"
                value={form.tipoPlano}
                onChange={handleChange}
              >
                <option></option>
                <option>Mensal</option>
                <option>Anual</option>
                <option>Trimestral</option>
                <option>Quadrimestral</option>
                <option>Não Pagante</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-link link-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button type="button" className="btn btn-primary ms-auto" onClick={handleSave}>
              {form.update === "Sim" ? "Salvar alterações" : "Salvar"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
