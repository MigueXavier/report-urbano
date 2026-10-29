import { useState } from 'react';
import Etapa from './Etapa';

export default function EtapaConsentimento({ onConcordar, onCancelar }) {
  const [recusou, setRecusou] = useState(false);

  if (recusou) {
    return (
      <Etapa
        titulo="Sem câmera e localização não dá para registrar"
        rodape={
          <>
            <button type="button" className="botao botao-primario" onClick={() => setRecusou(false)}>
              Rever o pedido
            </button>
            <button type="button" className="botao botao-secundario" onClick={onCancelar}>
              Voltar ao mapa
            </button>
          </>
        }
      >
        <p>
          A foto e o local são o que provam que o problema existe. Você ainda pode ver o mapa e as
          ocorrências de outras pessoas sem registrar nada.
        </p>
      </Etapa>
    );
  }

  return (
    <Etapa
      titulo="Antes de registrar"
      rodape={
        <>
          <button type="button" className="botao botao-primario" onClick={onConcordar}>
            Concordo e quero continuar
          </button>
          <button type="button" className="botao botao-secundario" onClick={() => setRecusou(true)}>
            Agora não
          </button>
        </>
      }
    >
      <ul className="lista-permissoes">
        <li>
          <span className="permissao-icone" aria-hidden="true">📷</span>
          <span>
            <strong>Câmera</strong>, para tirar a foto do problema.
          </span>
        </li>
        <li>
          <span className="permissao-icone" aria-hidden="true">📍</span>
          <span>
            <strong>Localização</strong>, só durante o registro, para marcar onde o problema está.
          </span>
        </li>
        <li>
          <span className="permissao-icone" aria-hidden="true">🙈</span>
          <span>
            <strong>Fotografe só o problema.</strong> Evite rostos, placas de carro ou moto e
            fachadas ou números que identifiquem alguém.
          </span>
        </li>
      </ul>
      <p className="texto-apoio">
        Seu nome não aparece na ocorrência, a não ser que você escolha mostrar. Esta tela só aparece
        no primeiro registro.
      </p>
    </Etapa>
  );
}
