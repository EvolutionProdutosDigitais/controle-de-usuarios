// components/ModalCadastroPagamentos.jsx
import React, { useEffect, useState } from "react";
import { IMaskInput } from "react-imask";
import { postCadastroPagamentos } from "../../../services/Gets";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";
import { useAlert } from "../../../components/utils/ui/AlertContext";
import { AlertOutlet } from "../../../components/utils/ui/AlertOutlet";

const EMPTY = {
  cpf: "",
  nome: "",
  dataPagamento: "",
  mesPago: "",
  anoPago: "",
};

const MES_MAP = [
  "janeiro", "fevereiro", "março", "marco", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
]

export function ModalCadastroPagamentos({ id = "modal-cadastro-pagamentos", initialData = null, mode = "create", onSubmit }) {
  const [form, setForm] = useState({
    cpf: "",
    nome: "",
    dataPagamento: "",
    mesPago: "",
    anoPago: "",
  });
  const [saving, setSaving] = useState(false);
  const { success, info, warning, danger, clear } = useAlert();


  // Preenche o formulário se vier dados para edição
  useEffect(() => {
    if (initialData) {
      setForm({
        cpf: initialData.cpf ?? "",
        nome: initialData.nome ?? "",
        dataPagamento: initialData.dataPagamento ?? "",
        mesPagamento: initialData.mesPagamento ?? "",
        anoPagamento: initialData.anoPagamento ?? "",
        update: "Sim",
      });
    } else {
      setForm(f => ({
        ...f,
      }));
    }
  }, [initialData]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dataPagamento") {
      setForm((f) => ({ ...f, dataPagamento: value }));
      return;
    }

    setForm((f) => ({ ...f, [name]: value }));
  };

  const resetForm = () => setForm(EMPTY);

  const handleSave = async () => {

    if (form.cpf.length !== 14) {
      warning("Cpf Inválido. Verifique e tente novamente.", { scope: scope });
      return;
    }

    if (form.cpf.trim() === "" || form.nome.trim() === "" || form.mesPago.trim() === "" || form.anoPago.trim() === "") {
      warning(("Favor preencher todos os campos."), { scope: scope });
      return;
    }

    const res = await postCadastroPagamentos(form, form.update);

    if (!res) {
      danger("Ocorreu um problema ao enviar os dados. Tente novamente.", { scope: scope });
      return;
    }

    resetForm();

    // fecha o modal
    const modal = document.getElementById(id);
    if (modal) {
      const instance = Modal.getInstance(modal)
        || new Modal(modal);
      instance.hide();
    }

  };

  return (
    <div
      className="modal"
      id={id}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalCadastroPagamentosTitle"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title" id="modalCadastroPagamentosTitle">
              {mode === "edit" ? "Atualizar pagamento" : "Cadastrar novo pagamento"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          <div className="modal-body">

            {/* CPF e Nome */}
            <div className="mb-3">
              <label className="form-label">CPF</label>
              <IMaskInput
                mask="000.000.000-00"
                name="cpf"
                value={form.cpf}
                onAccept={(value) => setForm({ ...form, cpf: value })}
                className="form-control form-control-rounded mb-2"
                placeholder="000.000.000-00"
                autoComplete="off"
              />

              <label className="form-label">Nome</label>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                className="form-control form-control-rounded"
                placeholder="Nome completo"
                autoComplete="off"
              />
            </div>

            {/* Data de pagamento */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Data do Pagamento</label>
                <input
                  type="date"
                  className="form-control form-control-rounded"
                  autoComplete="off"
                  name="dataPagamento"
                  value={form.dataPagamento}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Mês Pago</label>
                <select
                  className="form-select form-select-rounded"
                  name="mesPago"
                  value={form.mesPago}
                  onChange={handleChange}
                >
                  <option value="">Selecione o mês</option>
                  {MES_MAP.map((m, idx) => (
                    <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Ano Pago</label>
                <input
                  type="text"
                  name="anoPago"
                  value={form.anoPago || new Date().getFullYear()}
                  onChange={handleChange}
                  className="form-control form-control-rounded"
                  placeholder="Ex: 2025"
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-link link-secondary"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>

            <button
              type="button"
              className="btn btn-primary ms-auto"
              data-bs-dismiss="modal"
              onClick={handleSave}
            >
              {mode === "edit" ? "Salvar alterações" : "Cadastrar pagamento"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
