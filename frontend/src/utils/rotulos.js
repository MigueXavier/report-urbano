const tipos = {
  BURACO: "Buraco na via",
  CALCADA_DANIFICADA: "Calçada danificada",
  RAMPA_INEXISTENTE: "Falta de rampa",
  ILUMINACAO: "Iluminação precária",
  OBSTACULO: "Obstáculo na calçada",
};

const perfis = {
  CADEIRANTE: "Cadeirante",
  DEFICIENCIA_VISUAL: "Deficiência visual",
  IDOSO: "Idoso",
  CARRINHO_BEBE: "Carrinho de bebê",
  MOBILIDADE_REDUZIDA: "Mobilidade reduzida",
};

const gravidades = {
  BAIXA: "Gravidade baixa",
  MEDIA: "Gravidade média",
  ALTA: "Gravidade alta",
};

const status = {
  ABERTA: "Aberta",
  EM_ANALISE: "Em análise",
  RESOLVIDA: "Resolvida",
};

export const rotuloTipo = (valor) => tipos[valor] || valor;
export const rotuloPerfil = (valor) => perfis[valor] || valor;
export const rotuloGravidade = (valor) => gravidades[valor] || valor;
export const rotuloStatus = (valor) => status[valor] || valor;

export function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR");
}

export function plural(qtd, singular, pluralTexto) {
  return `${qtd} ${qtd === 1 ? singular : pluralTexto}`;
}
