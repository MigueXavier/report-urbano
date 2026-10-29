import { useEffect, useState } from 'react';
import { capturaCompleta, paraRequisicao, useRascunhoOcorrencia } from './RascunhoOcorrenciaContext';
import EtapaConsentimento from './captura/EtapaConsentimento';
import EtapaFoto from './captura/EtapaFoto';
import EtapaLocalizacao from './captura/EtapaLocalizacao';
import Etapa from './captura/Etapa';
import { jaConsentiu, registrarConsentimento } from './captura/consentimento';
import { useLocalizacaoGps } from './captura/useLocalizacaoGps';
import './captura/captura.css';

const ETAPAS = ['foto', 'localizacao', 'classificacao'];

export default function RegistroOcorrencia({ onCancelar = () => {} }) {
  const [consentiu, setConsentiu] = useState(jaConsentiu);
  const [indice, setIndice] = useState(0);
  const gps = useLocalizacaoGps();

  const { estado: estadoGps, buscar: buscarGps } = gps;
  useEffect(() => {
    if (consentiu && estadoGps === 'parado') buscarGps();
  }, [consentiu, estadoGps, buscarGps]);

  const avancar = () => setIndice((i) => Math.min(i + 1, ETAPAS.length - 1));
  const voltar = () => (indice === 0 ? onCancelar() : setIndice((i) => i - 1));
  const passo = { passo: indice + 1, totalPassos: ETAPAS.length };

  if (!consentiu) {
    return (
      <EtapaConsentimento
        onConcordar={() => {
          registrarConsentimento();
          setConsentiu(true);
        }}
        onCancelar={onCancelar}
      />
    );
  }

  switch (ETAPAS[indice]) {
    case 'foto':
      return <EtapaFoto {...passo} onContinuar={avancar} onVoltar={voltar} />;
    case 'localizacao':
      return <EtapaLocalizacao {...passo} gps={gps} onContinuar={avancar} onVoltar={voltar} />;
    default:
      return <ClassificacaoPendente {...passo} onVoltar={voltar} />;
  }
}

function ClassificacaoPendente({ passo, totalPassos, onVoltar }) {
  const { rascunho } = useRascunhoOcorrencia();
  return (
    <Etapa
      titulo="Captura concluída"
      passo={passo}
      totalPassos={totalPassos}
      rodape={
        <button type="button" className="botao botao-secundario" onClick={onVoltar}>
          Voltar
        </button>
      }
    >
      <p>
        {capturaCompleta(rascunho)
          ? 'Foto e local prontos. A próxima tela é a classificação da ocorrência.'
          : 'Falta a foto ou o local.'}
      </p>
      <pre className="rascunho-debug">{JSON.stringify(paraRequisicao(rascunho), null, 2)}</pre>
    </Etapa>
  );
}
