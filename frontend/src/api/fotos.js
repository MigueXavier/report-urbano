import { API_URL } from './config';

export async function enviarFoto(arquivo, { signal } = {}) {
  const dados = new FormData();
  dados.append('foto', arquivo);

  let resposta;
  try {
    resposta = await fetch(`${API_URL}/uploads/fotos`, { method: 'POST', body: dados, signal });
  } catch (erro) {
    if (erro.name === 'AbortError') throw erro;
    throw new Error('Não foi possível enviar a foto. Verifique sua conexão com a internet e tente de novo.');
  }

  if (!resposta.ok) {
    const corpo = await resposta.json().catch(() => null);
    throw new Error(corpo?.erro || 'O servidor não aceitou a foto. Tente de novo em instantes.');
  }

  const { fotoUrl } = await resposta.json();
  return fotoUrl;
}
