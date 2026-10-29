import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useApp} from '../context/AppContext';
import Mapa from '../components/Mapa';
import {Bar, Card, Chip, Escolha, Row, Photo} from '../components/ui';
import {TIPOS, PERFIS, GRAVIDADES, DESC_MAX, CENTRO, dist} from '../data/mock';

// Titulo de cada uma das 5 etapas do registro
const TITULOS = [
  'Foto da ocorrência',
  'Confirme o local',
  'Verificar duplicata',
  'Classificar ocorrência',
  'Confirmar envio'
];

export default function NovaDenuncia() {
  const {list, add} = useApp();
  const navegar = useNavigate();

  const [etapa, setEtapa] = useState(1);
  const [foto, setFoto] = useState(null);
  const [posicao, setPosicao] = useState(CENTRO);

  // RF07 a RF11: a classificacao comeca toda vazia, sem nenhuma opcao marcada,
  // para o sistema nao gravar um valor que o usuario nao escolheu.
  const [tipo, setTipo] = useState(null);
  const [acessibilidade, setAcessibilidade] = useState(null);
  const [perfis, setPerfis] = useState([]);
  const [gravidade, setGravidade] = useState(null);
  const [descricao, setDescricao] = useState('');

  // Pega a localizacao do celular assim que a tela abre
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (local) {
        setPosicao([local.coords.latitude, local.coords.longitude]);
      });
    }
  }, []);

  // RF19: procura ocorrencias que estao a 20 metros ou menos do ponto escolhido
  const duplicatas = list.filter(function (ocorrencia) {
    return dist(ocorrencia.pos, posicao) <= 20;
  });

  const endereco = posicao[0].toFixed(5) + ', ' + posicao[1].toFixed(5);

  function avancar() {
    if (etapa === 2 && duplicatas.length === 0) {
      // Nao achou nenhuma parecida, entao pula a etapa 3
      setEtapa(4);
    } else {
      setEtapa(etapa + 1);
    }
  }

  function voltar() {
    if (etapa === 1) {
      navegar(-1);
    } else if (etapa === 4 && duplicatas.length === 0) {
      setEtapa(2);
    } else {
      setEtapa(etapa - 1);
    }
  }

  // RF08: responder "Nao" limpa os perfis que ja estavam marcados, senao eles
  // seriam enviados sem impacto declarado.
  function escolherAcessibilidade(resposta) {
    if (resposta === 'Sim') {
      setAcessibilidade(true);
    } else {
      setAcessibilidade(false);
      setPerfis([]);
    }
  }

  // RF09: marca ou desmarca um perfil afetado
  function marcarPerfil(perfil) {
    if (perfis.includes(perfil)) {
      setPerfis(perfis.filter((item) => item !== perfil));
    } else {
      setPerfis([...perfis, perfil]);
    }
  }

  // Monta a lista do que ainda falta ser preenchido na classificacao
  function camposQueFaltam() {
    const faltando = [];

    if (tipo === null) {
      faltando.push('o tipo');
    }
    if (acessibilidade === null) {
      faltando.push('o impacto em acessibilidade');
    }
    if (acessibilidade === true && perfis.length === 0) {
      faltando.push('pelo menos um perfil afetado');
    }
    if (gravidade === null) {
      faltando.push('a gravidade');
    }

    return faltando;
  }

  const faltam = camposQueFaltam();

  // Junta a lista separando por virgula e colocando "e" antes do ultimo item
  function textoDoQueFalta() {
    if (faltam.length === 1) {
      return faltam[0];
    }

    const ultimo = faltam[faltam.length - 1];
    const anteriores = faltam.slice(0, faltam.length - 1);

    return anteriores.join(', ') + ' e ' + ultimo;
  }

  function enviar() {
    // RNF18: sem internet nao da para enviar, entao avisa o usuario
    if (!navigator.onLine) {
      navegar('/erro');
      return;
    }

    add({
      tipo: tipo,
      acess: acessibilidade,
      perfis: perfis,
      grav: gravidade,
      desc: descricao,
      pos: posicao,
      foto: foto,
      end: endereco,
      status: 'Aberta',
      dias: 0,
      conf: 1,
      data: new Date().toLocaleDateString('pt-BR'),
      autor: 'Você'
    });

    navegar('/mapa');
  }

  function escolherFoto(evento) {
    if (evento.target.files[0]) {
      setFoto(URL.createObjectURL(evento.target.files[0]));
    }
  }

  function textoDoBotao() {
    if (etapa === 5) {
      return 'Confirmar envio';
    }
    if (etapa === 2) {
      return 'Confirmar local';
    }
    return 'Continuar';
  }

  // Trava o botao enquanto falta foto (etapa 1) ou falta classificar (etapa 4)
  function botaoTravado() {
    if (etapa === 1 && !foto) {
      return true;
    }
    if (etapa === 4 && faltam.length > 0) {
      return true;
    }
    return false;
  }

  return (
    <main className="scr">
      <Bar
        title={etapa + '/5 · ' + TITULOS[etapa - 1]}
        back={false}
        right={
          <button className="ico" aria-label="Voltar" onClick={voltar}>←</button>
        }
      />

      <div className="progress-track" aria-label={'Etapa ' + etapa + ' de 5'}>
        <span style={{width: etapa * 20 + '%'}} />
      </div>

      {/* Etapa 1 - foto da ocorrencia */}
      {etapa === 1 && (
        <>
          <Photo src={foto} />

          <label className="btn sec ln">
            {foto ? 'Trocar foto' : 'Tirar foto ou escolher da galeria'}
            <input
              hidden
              type="file"
              accept="image/*"
              capture="environment"
              onChange={escolherFoto}
            />
          </label>

          <small>
            Evite fotografar pessoas, placas de veículos ou fachadas identificáveis.
          </small>
        </>
      )}

      {/* Etapa 2 - ajustar o local no mapa */}
      {etapa === 2 && (
        <>
          <Mapa pick={posicao} onPick={setPosicao} />
          <small>Arraste o pino ou clique no mapa para ajustar o local.</small>
        </>
      )}

      {/* Etapa 3 - ocorrencias parecidas por perto (RF19) */}
      {etapa === 3 && (
        <>
          <h2>⚠ Foram detectadas {duplicatas.length} denúncias próximas</h2>

          <div className="grid">
            {duplicatas.map(function (ocorrencia) {
              return (
                <Card
                  key={ocorrencia.id}
                  o={ocorrencia}
                  onClick={() => navegar('/ocorrencia/' + ocorrencia.id)}
                />
              );
            })}
          </div>
        </>
      )}

      {/* Etapa 4 - classificacao da ocorrencia (RF07 a RF11) */}
      {etapa === 4 && (
        <>
          {/* RF07 - tipo da ocorrencia */}
          <div className="field">
            <h2>Tipo de ocorrência</h2>
            <Escolha
              label="Tipo de ocorrência"
              cls="chips tipos"
              opts={TIPOS}
              v={tipo}
              set={setTipo}
            />
          </div>

          {/* RF08 - impacto em acessibilidade */}
          <div className="field">
            <h2>Impacta a acessibilidade?</h2>
            <Escolha
              label="Impacta a acessibilidade?"
              cls="seg"
              chip={false}
              opts={['Sim', 'Não']}
              v={acessibilidade === null ? null : acessibilidade ? 'Sim' : 'Não'}
              set={escolherAcessibilidade}
            />
            <small>
              Responda "Sim" se a ocorrência impede ou dificulta a passagem de alguém.
            </small>
          </div>

          {/* RF09 - perfis afetados, so aparece se impactar a acessibilidade */}
          {acessibilidade === true && (
            <div className="field">
              <h2>Perfis afetados</h2>

              <div className="chips" role="group" aria-label="Perfis afetados">
                {PERFIS.map(function (perfil) {
                  return (
                    <Chip
                      key={perfil}
                      on={perfis.includes(perfil)}
                      onClick={() => marcarPerfil(perfil)}
                    >
                      {perfil}
                    </Chip>
                  );
                })}
              </div>

              <small>Marque todos os perfis que a ocorrência atinge.</small>
            </div>
          )}

          {/* RF10 - gravidade */}
          <div className="field">
            <h2>Gravidade</h2>
            <Escolha
              label="Gravidade"
              cls="seg"
              chip={false}
              opts={GRAVIDADES}
              v={gravidade}
              set={setGravidade}
            />
          </div>

          {/* RF11 - descricao opcional, nenhum texto e obrigatorio (RNF12) */}
          <label>
            Descrição (opcional)
            <textarea
              rows={3}
              maxLength={DESC_MAX}
              value={descricao}
              aria-describedby="desc-ajuda"
              onChange={(evento) => setDescricao(evento.target.value)}
            />
          </label>

          <div className="field-foot">
            <small id="desc-ajuda">Nenhum campo de texto é obrigatório.</small>
            <small>{descricao.length}/{DESC_MAX}</small>
          </div>
        </>
      )}

      {/* Etapa 5 - conferir tudo antes de enviar */}
      {etapa === 5 && (
        <>
          <Photo src={foto} />

          <div className="tbl">
            <Row k="Tipo" v={tipo} />
            <Row k="Impacta acessibilidade" v={acessibilidade ? 'Sim' : 'Não'} />
            {acessibilidade && <Row k="Perfis afetados" v={perfis.join(', ')} />}
            <Row k="Gravidade" v={gravidade} />
            <Row k="Local" v={endereco} />
            <Row k="Descrição" v={descricao || '—'} />
          </div>
        </>
      )}

      <div className="col foot">
        {etapa === 4 && faltam.length > 0 && (
          <p className="hint" role="status">
            Para continuar, informe {textoDoQueFalta()}.
          </p>
        )}

        {etapa === 3 ? (
          <button className="btn" onClick={avancar}>
            Nenhum é o meu, continuar
          </button>
        ) : (
          <button
            className="btn"
            disabled={botaoTravado()}
            onClick={etapa === 5 ? enviar : avancar}
          >
            {textoDoBotao()}
          </button>
        )}
      </div>
    </main>
  );
}
