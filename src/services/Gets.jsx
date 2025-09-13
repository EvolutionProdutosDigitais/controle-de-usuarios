const idScript = import.meta.env.VITE_ID_SCRIPT;

// Base SEM querystring
const baseURL = `https://script.google.com/macros/s/${idScript}/exec`;

// GET: passa a action na query
export const getDados = async (action) => {
  const url = `${baseURL}?action=${encodeURIComponent(action)}`;
  try {
    const response = await fetch(url, { method: "GET", cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Erro ao obter dados:", err);
    return [];
  }
};

// POST alunos
export const postCadastroAlunos = async (payload) => {
  const formData = new FormData();
  formData.append("cpf", payload.cpf ?? "");
  formData.append("nome", payload.nome ?? "");
  formData.append("dataNascimento", payload.dataNascimento ?? ""); // confere com Apps Script
  formData.append("idade", String(payload.idade ?? 0));
  formData.append("tipoPlano", payload.tipoPlano ?? "Mensal");     // confere com Apps Script
  formData.append("update", payload.update ?? "");                         // ex.: "Sim" para atualizar
  formData.append("action", "postCadastroAluno");

  try {
    const res = await fetch(baseURL, { method: "POST", body: formData });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // se seu doPost retorna JSON:
    // const data = await res.json();
    // return data;
    return true;
  } catch (err) {
    console.error("Erro ao cadastrar/atualizar aluno:", err);
    return false;
  }
};

// POST pagamentos
export const postCadastroPagamentos = async (payload, update) => {
  const formData = new FormData();
  formData.append("cpf", payload.cpf ?? "");
  formData.append("nome", payload.nome ?? "");
  formData.append("dataPagamento", payload.dataPagamento ?? "");
  formData.append("mesPago", String(payload.mesPago ?? "")); // se for texto (Agosto), mantenha string
  formData.append("anoPago", String(payload.anoPago ?? ""));
  formData.append("update", update ?? "");
  formData.append("action", "postCadastroPagamento");

  try {
    const res = await fetch(baseURL, { method: "POST", body: formData });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // const data = await res.json();
    // return data;
    return true;
  } catch (err) {
    console.error("Erro ao cadastrar/atualizar pagamento:", err);
    return false;
  }
};
