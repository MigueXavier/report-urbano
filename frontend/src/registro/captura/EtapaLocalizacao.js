import { useCallback, useEffect, useState } from 'react';
import { useRascunhoOcorrencia } from '../RascunhoOcorrenciaContext';
import Etapa from './Etapa';
import MapaAjusteLocalizacao from './MapaAjusteLocalizacao';
import { CENTRO_BH, distanciaEmMetros } from './geo';

const DISTANCIA_AVISO_METROS = 200;

export default function EtapaLocalizacao({ passo, totalPassos, gps, onContinuar, onVoltar }) {
  const { rascunho, atualizarRascunho } = useRascunhoOcorrencia();
  const [manual, setManual] = useState(false);
  const [versaoCentro, setVersaoCentro] = useState(0);

  const temPonto = rascunho.latitude != null && rascunho.longitude != null;

  useEffect(() => {
    if (gps.estado === 'ok' && !temPonto) {
      atualizarRascunho({
        latitude: gps.posicao.latitude,
        longitude: gps.posicao.longitude,
        _localizacaoGps: gps.posicao,
      });
      setVersaoCentro((v) => v + 1);
    }
  }, [gps.estado, gps.posicao, temPonto, atualizarRascunho]);

  const moverPino = useCallback(
    ({ latitude, longitude }) => atualizarRascunho({ latitude, longitude }),
    [atualizarRascunho]
  );

  function marcarManualmente() {
    setManual(true);
    if (!temPonto) atualizarRascunho({ ...CENTRO_BH });
    setVersaoCentro((v) => v + 1);
  }

  function voltarParaGps() {
    const origem = rascunho._localizacaoGps;
    if (!origem) return;
    atualizarRascunho({ latitude: origem.latitude, longitude: origem.longitude });
    setVersaoCentro((v) => v + 1);
  }

  const mostrarMapa = temPonto || manual;
  const origem = rascunho._localizacaoGps;
  const distancia = temPonto && origem ? Math.round(distanciaEmMetros(origem, rascunho)) : null;

  return (
    <Etapa
      titulo="Onde está o problema?"
      passo={passo}
      totalPassos={totalPassos}
      rodape={
        <>
          <button
            type="button"
            className="botao botao-primario"
            onClick={onContinuar}
            disabled={!temPonto}
          >
            Confirmar local
          </button>
          <button type="button" className="botao botao-secundario" onClick={onVoltar}>
            Voltar
          </button>
        </>
      }
    >
      {!mostrarMapa && gps.estado !== 'erro' && (
        <p role="status" aria-live="polite" className="status-gps">
          Buscando sua localização...
        </p>
      )}

      {!mostrarMapa && gps.estado === 'erro' && (
        <div role="alert" className="mensagem-erro">
          <p>{gps.erro}</p>
          <div className="acoes-erro">
            <button type="button" className="botao botao-secundario" onClick={gps.buscar}>
              Tentar de novo
            </button>
            <button type="button" className="botao botao-secundario" onClick={marcarManualmente}>
              Marcar no mapa
            </button>
          </div>
        </div>
      )}

      {mostrarMapa && (
        <>
          <p className="texto-apoio">
            Arraste o pino ou toque no mapa para colocar o pino exatamente em cima do problema.
          </p>
          <MapaAjusteLocalizacao
            ponto={temPonto ? rascunho : CENTRO_BH}
            onMover={moverPino}
            versaoCentro={versaoCentro}
          />
          <div role="status" aria-live="polite" className="status-gps">
            {origem && distancia !== null && distancia < 5 && (
              <>Pino na sua localização (precisão de cerca de {origem.precisao} m).</>
            )}
            {origem && distancia !== null && distancia >= 5 && <>Pino a {distancia} m de onde você está.</>}
            {!origem && <>Local marcado manualmente no mapa.</>}
          </div>
          {distancia !== null && distancia > DISTANCIA_AVISO_METROS && (
            <p className="mensagem-aviso">
              O pino está longe de onde você está. Confira se é o lugar certo do problema.
            </p>
          )}
          {origem && (
            <button type="button" className="botao botao-texto" onClick={voltarParaGps}>
              Voltar o pino para minha localização
            </button>
          )}
        </>
      )}
    </Etapa>
  );
}
