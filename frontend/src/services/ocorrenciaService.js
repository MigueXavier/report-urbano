import { ocorrenciasMock } from "./dadosMock";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
const USAR_MOCK = process.env.REACT_APP_USAR_MOCK !== "false";

function headers() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function buscarOcorrencia(id) {
  if (USAR_MOCK) {
    const ocorrencia = ocorrenciasMock.find((o) => o.id === id);
    if (!ocorrencia) throw new Error("Ocorrência não encontrada");
    return ocorrencia;
  }

  const resposta = await fetch(`${API_URL}/ocorrencias/${id}`, { headers: headers() });
  if (!resposta.ok) {
    throw new Error(resposta.status === 404 ? "Ocorrência não encontrada" : "Erro ao carregar ocorrência");
  }
  return resposta.json();
}

export async function listarMinhasOcorrencias() {
  if (USAR_MOCK) {
    return ocorrenciasMock;
  }

  const resposta = await fetch(`${API_URL}/usuarios/me/ocorrencias`, { headers: headers() });
  if (!resposta.ok) {
    throw new Error("Erro ao carregar seu histórico");
  }
  return resposta.json();
}
