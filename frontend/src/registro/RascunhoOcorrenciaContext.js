import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export const RASCUNHO_VAZIO = {
  fotoUrl: null,
  latitude: null,
  longitude: null,

  tipo: null,
  impactaAcessibilidade: null,
  perfisAfetados: [],
  gravidade: null,
  descricao: '',

  autorPublico: false,

  _fotoPreview: null,
  _localizacaoGps: null,
};

const RascunhoOcorrenciaContext = createContext(null);

export function RascunhoOcorrenciaProvider({ children, inicial = RASCUNHO_VAZIO }) {
  const [rascunho, setRascunho] = useState(inicial);

  const atualizarRascunho = useCallback((parcial) => {
    setRascunho((atual) => ({ ...atual, ...parcial }));
  }, []);

  const limparRascunho = useCallback(() => {
    setRascunho((atual) => {
      if (atual._fotoPreview) URL.revokeObjectURL(atual._fotoPreview);
      return RASCUNHO_VAZIO;
    });
  }, []);

  const valor = useMemo(
    () => ({ rascunho, atualizarRascunho, limparRascunho }),
    [rascunho, atualizarRascunho, limparRascunho]
  );

  return (
    <RascunhoOcorrenciaContext.Provider value={valor}>{children}</RascunhoOcorrenciaContext.Provider>
  );
}

export function useRascunhoOcorrencia() {
  const contexto = useContext(RascunhoOcorrenciaContext);
  if (!contexto) {
    throw new Error('useRascunhoOcorrencia precisa estar dentro de <RascunhoOcorrenciaProvider>');
  }
  return contexto;
}

export function capturaCompleta(rascunho) {
  return Boolean(rascunho.fotoUrl) && rascunho.latitude != null && rascunho.longitude != null;
}

export function paraRequisicao(rascunho) {
  return Object.fromEntries(Object.entries(rascunho).filter(([chave]) => !chave.startsWith('_')));
}
