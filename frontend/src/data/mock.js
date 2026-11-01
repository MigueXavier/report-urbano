// RF07 - tipos de ocorrencia. Os textos sao iguais aos do enum TipoOcorrencia do back-end.
export const TIPOS = [
  'Buraco na via',
  'Calçada danificada',
  'Ausência de rampa',
  'Degrau',
  'Piso tátil ausente',
  'Vaga de idoso/PCD inexistente',
  'Obstáculo em passeio',
  'Lixo ou entulho',
  'Iluminação',
  'Alagamento recorrente'
];

// RF09 - perfis afetados. Textos iguais aos do enum PerfilAfetado.
export const PERFIS = [
  'Cadeirante',
  'Mobilidade reduzida',
  'Baixa visão',
  'Idoso',
];

// RF10 - gravidade. Textos iguais aos do enum Gravidade.
export const GRAVIDADES = [
  'Leve',
  'Moderada',
  'Grave'
];

// RF11 - limite da descricao, o mesmo do @Size(max = 1000) em ClassificacaoOcorrencia
export const DESC_MAX = 1000;

// [ocorrencias abertas, dias sem resposta, resolvidas em 30 dias] - dados ficticios
export const REGIOES = {
  Centro_Sul: [220, 18, 30],
  Pampulha: [140, 22, 12],
  Venda_Nova: [95, 31, 8],
  Barreiro: [120, 27, 10],
  Leste: [80, 19, 15]
};

// Centro de Belo Horizonte, usado quando o GPS nao responde
export const CENTRO = [-19.9208, -43.9378];

export const SEED = [
  {
    id: 1,
    tipo: 'Calçada danificada',
    grav: 'Moderada',
    acess: true,
    status: 'Aberta',
    pos: [-19.9215, -43.9385],
    dias: 21,
    conf: 8,
    data: '16/09/2026',
    end: 'Av. Afonso Pena, 1500',
    autor: 'Você'
  },
  {
    id: 2,
    tipo: 'Ausência de rampa',
    grav: 'Grave',
    acess: true,
    status: 'Aberta',
    pos: [-19.919, -43.935],
    dias: 9,
    conf: 4,
    data: '28/09/2026',
    end: 'Rua da Bahia, 900',
    autor: 'Outro'
  },
  {
    id: 3,
    tipo: 'Buraco na via',
    grav: 'Leve',
    acess: false,
    status: 'Aberta',
    pos: [-19.9235, -43.941],
    dias: 45,
    conf: 12,
    data: '22/08/2026',
    end: 'Av. do Contorno, 3000',
    autor: 'Você'
  },
  {
    id: 4,
    tipo: 'Lixo ou entulho',
    grav: 'Leve',
    acess: false,
    status: 'Resolvida',
    pos: [-19.917, -43.942],
    dias: 3,
    conf: 20,
    data: '01/10/2026',
    end: 'Rua Sergipe, 120',
    autor: 'Outro'
  }
];

// Distancia aproximada em metros entre dois pontos do mapa.
// Serve para achar as ocorrencias proximas no raio de 20 m (RF19).
export function dist(pontoA, pontoB) {
  const [latA, lonA] = pontoA;
  const [latB, lonB] = pontoB;

  const grausParaRadianos = Math.PI / 180;
  const raioDaTerra = 6371000;

  const x = (lonB - lonA) * grausParaRadianos * Math.cos(((latA + latB) * grausParaRadianos) / 2);
  const y = (latB - latA) * grausParaRadianos;

  return raioDaTerra * Math.hypot(x, y);
}
