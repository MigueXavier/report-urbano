
const API = process.env.REACT_APP_API_URL || 'http://localhost:8080';

async function req(path, opts = {}) {
  const token = localStorage.getItem('token');
  const r = await fetch(API + path, {
    ...opts,
    headers: { ...(token && { Authorization: `Bearer ${token}` }), ...opts.headers },
  });
  if (!r.ok) throw new Error((await r.text()) || `Erro ${r.status}`);
  return r.status === 204 ? null : r.json();
}


export async function enviarFoto(arquivo) {
  const fd = new FormData();
  fd.append('foto', arquivo);
  return (await req('/fotos', { method: 'POST', body: fd })).url;
}


export async function criarOcorrencia(rascunho, arquivo) {
  const fotoUrl = await enviarFoto(arquivo);
  return req('/ocorrencias', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fotoUrl,
      latitude: rascunho.pos[0],
      longitude: rascunho.pos[1],
      tipo: rascunho.tipo,
      impactaAcessibilidade: rascunho.acess,
      perfisAfetados: rascunho.perfis,
      gravidade: rascunho.grav,
      descricao: rascunho.desc || null,
    }),
  });
}
