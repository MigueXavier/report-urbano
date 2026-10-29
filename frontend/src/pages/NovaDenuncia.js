import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Mapa from '../components/Mapa';
import { Bar, Card, Chip, Seg, Row, Photo } from '../components/ui';
import { TIPOS, PERFIS, CENTRO, dist } from '../data/mock';
import { criarOcorrencia } from '../api';


const FOTO = 1;
const LOCAL = 2;
const DUPLICATAS = 3;
const CLASSIFICACAO = 4;
const CONFIRMACAO = 5;

const TITULOS = {
  [FOTO]: 'Foto da ocorrência',
  [LOCAL]: 'Confirme o local',
  [DUPLICATAS]: 'Verificar duplicata',
  [CLASSIFICACAO]: 'Classificar ocorrência',
  [CONFIRMACAO]: 'Confirmar envio',
};

const RAIO_DUPLICATA_METROS = 20; // RF19

export default function NovaDenuncia() {
  const { list, add } = useApp();
  const navigate = useNavigate();

  const [etapa, setEtapa] = useState(FOTO);
  const [previaFoto, setPreviaFoto] = useState(null); 
  const [arquivoFoto, setArquivoFoto] = useState(null); 
  const [posicao, setPosicao] = useState(CENTRO); 
  const [enviando, setEnviando] = useState(false);

  
  const [rascunho, setRascunho] = useState({
    tipo: TIPOS[2],
    acess: true, 
    perfis: [], 
    grav: 'Moderada', 
    desc: '', 
  });

 
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition((p) =>
      setPosicao([p.coords.latitude, p.coords.longitude])
    );
  }, []);

  
  const duplicatas = list.filter((o) => dist(o.pos, posicao) <= RAIO_DUPLICATA_METROS);
  const temDuplicatas = duplicatas.length > 0;
  const enderecoTexto = `${posicao[0].toFixed(5)}, ${posicao[1].toFixed(5)}`;

  function alterarCampo(campo, valor) {
    setRascunho((atual) => ({ ...atual, [campo]: valor }));
  }

  function alternarPerfil(perfil) {
    const jaMarcado = rascunho.perfis.includes(perfil);
    alterarCampo(
      'perfis',
      jaMarcado ? rascunho.perfis.filter((p) => p !== perfil) : [...rascunho.perfis, perfil]
    );
  }

  function escolherFoto(evento) {
    const arquivo = evento.target.files[0];
    if (!arquivo) return;
    setArquivoFoto(arquivo);
    setPreviaFoto(URL.createObjectURL(arquivo));
  }

  
  function avancar() {
    if (etapa === LOCAL && !temDuplicatas) setEtapa(CLASSIFICACAO);
    else setEtapa(etapa + 1);
  }

  function voltar() {
    if (etapa === FOTO) navigate(-1);
    else if (etapa === CLASSIFICACAO && !temDuplicatas) setEtapa(LOCAL);
    else setEtapa(etapa - 1);
  }

  async function enviar() {
    if (!navigator.onLine) return navigate('/erro'); // RNF18

    setEnviando(true);
    try {
      
      const salva = await criarOcorrencia({ ...rascunho, pos: posicao }, arquivoFoto);

      
      add({
        ...rascunho,
        id: salva.id,
        pos: posicao,
        foto: salva.fotoUrl,
        end: enderecoTexto,
        status: 'Aberta',
        dias: 0,
        conf: 0,
        data: new Date(salva.criadoEm).toLocaleDateString('pt-BR'),
        autor: 'Você',
      });
      navigate('/mapa');
    } catch (erro) {
      alert('Não foi possível enviar: ' + erro.message);
    } finally {
      setEnviando(false);
    }
  }

  function textoDoBotao() {
    if (etapa === CONFIRMACAO) return enviando ? 'Enviando…' : 'Confirmar envio';
    if (etapa === LOCAL) return 'Confirmar local';
    return 'Continuar';
  }

  return (
    <main className="scr">
      <Bar
        title={`${etapa}/5 · ${TITULOS[etapa]}`}
        back={false}
        right={<button className="ico" aria-label="Voltar" onClick={voltar}>←</button>}
      />

      <div className="progress-track" aria-label={`Etapa ${etapa} de 5`}>
        <span style={{ width: `${etapa * 20}%` }} />
      </div>

      {etapa === FOTO && (
        <>
          <Photo src={previaFoto} />
          <label className="btn sec ln">
            {previaFoto ? 'Trocar foto' : 'Tirar foto ou escolher da galeria'}
            <input hidden type="file" accept="image/*" capture="environment" onChange={escolherFoto} />
          </label>
          <small>Evite fotografar pessoas, placas de veículos ou fachadas identificáveis.</small>
        </>
      )}

      {etapa === LOCAL && (
        <>
          <Mapa pick={posicao} onPick={setPosicao} />
          <small>Arraste o pino ou clique no mapa para ajustar o local.</small>
        </>
      )}

      {etapa === DUPLICATAS && (
        <>
          <h2>⚠ Foram detectadas {duplicatas.length} denúncias próximas</h2>
          <div className="grid">
            {duplicatas.map((o) => (
              <Card key={o.id} o={o} onClick={() => navigate('/ocorrencia/' + o.id)} />
            ))}
          </div>
        </>
      )}

      {etapa === CLASSIFICACAO && (
        <>
          <label>
            Tipo
            <select value={rascunho.tipo} onChange={(e) => alterarCampo('tipo', e.target.value)}>
              {TIPOS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>

          <label className="chk">
            <input
              type="checkbox"
              checked={rascunho.acess}
              onChange={(e) => alterarCampo('acess', e.target.checked)}
            />{' '}
            Impacta acessibilidade
          </label>

          {rascunho.acess && (
            <>
              <h2>Perfis afetados</h2>
              <div className="chips">
                {PERFIS.map((p) => (
                  <Chip key={p} on={rascunho.perfis.includes(p)} onClick={() => alternarPerfil(p)}>
                    {p}
                  </Chip>
                ))}
              </div>
            </>
          )}

          <h2>Gravidade</h2>
          <Seg opts={['Leve', 'Moderada', 'Grave']} v={rascunho.grav} set={(v) => alterarCampo('grav', v)} />

          <label>
            Descrição (opcional)
            <textarea rows={3} value={rascunho.desc} onChange={(e) => alterarCampo('desc', e.target.value)} />
          </label>
        </>
      )}

      {etapa === CONFIRMACAO && (
        <>
          <Photo src={previaFoto} />
          <div className="tbl">
            <Row k="Tipo" v={rascunho.tipo} />
            <Row k="Gravidade" v={rascunho.grav} />
            <Row k="Local" v={enderecoTexto} />
            <Row k="Descrição" v={rascunho.desc || '—'} />
          </div>
        </>
      )}

      <div className="col foot">
        {etapa === DUPLICATAS ? (
          <button className="btn" onClick={avancar}>Nenhum é o meu, continuar</button>
        ) : (
          <button
            className="btn"
            disabled={(etapa === FOTO && !previaFoto) || enviando}
            onClick={etapa === CONFIRMACAO ? enviar : avancar}
          >
            {textoDoBotao()}
          </button>
        )}
      </div>
    </main>
  );
}
