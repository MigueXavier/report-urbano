import { useCallback, useEffect, useRef, useState } from 'react';
import { enviarFoto } from '../../api/fotos';
import { useRascunhoOcorrencia } from '../RascunhoOcorrenciaContext';
import CameraAoVivo, { cameraDisponivel } from './CameraAoVivo';
import Etapa from './Etapa';

const TIPOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANHO_MAXIMO = 10 * 1024 * 1024;

export default function EtapaFoto({ passo, totalPassos, onContinuar, onVoltar }) {
  const { rascunho, atualizarRascunho } = useRascunhoOcorrencia();
  const [arquivo, setArquivo] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [usarCamera, setUsarCamera] = useState(() => cameraDisponivel());
  const [cameraAberta, setCameraAberta] = useState(() => cameraDisponivel() && !rascunho._fotoPreview);
  const inputRef = useRef(null);
  const envioAtual = useRef(null);

  useEffect(() => () => envioAtual.current?.abort(), []);

  async function enviar(foto) {
    envioAtual.current?.abort();
    const controle = new AbortController();
    envioAtual.current = controle;

    setEnviando(true);
    setErro(null);
    try {
      const fotoUrl = await enviarFoto(foto, { signal: controle.signal });
      atualizarRascunho({ fotoUrl });
    } catch (e) {
      if (e.name === 'AbortError') return;
      setErro(e.message);
    } finally {
      if (envioAtual.current === controle) setEnviando(false);
    }
  }

  function usarFoto(foto) {
    if (rascunho._fotoPreview) URL.revokeObjectURL(rascunho._fotoPreview);
    atualizarRascunho({ fotoUrl: null, _fotoPreview: URL.createObjectURL(foto) });
    setArquivo(foto);
    setCameraAberta(false);
    enviar(foto);
  }

  function aoEscolherArquivo(evento) {
    const foto = evento.target.files?.[0];
    evento.target.value = '';
    if (!foto) return;

    if (!TIPOS_ACEITOS.includes(foto.type)) {
      setErro('Formato não aceito. Use uma foto JPG, PNG ou WEBP.');
      return;
    }
    if (foto.size > TAMANHO_MAXIMO) {
      setErro('A foto é grande demais. O limite é 10 MB.');
      return;
    }
    usarFoto(foto);
  }

  const aoErroCamera = useCallback((mensagem) => {
    setCameraAberta(false);
    setUsarCamera(false);
    setErro(mensagem);
  }, []);

  function tirarFoto() {
    setErro(null);
    if (usarCamera) setCameraAberta(true);
    else inputRef.current?.click();
  }

  const escolherArquivo = () => inputRef.current?.click();
  const temFoto = Boolean(rascunho._fotoPreview);
  const fotoPronta = Boolean(rascunho.fotoUrl) && !enviando;

  return (
    <Etapa
      titulo="Foto do problema"
      passo={passo}
      totalPassos={totalPassos}
      rodape={
        <>
          <button
            type="button"
            className="botao botao-primario"
            onClick={onContinuar}
            disabled={!fotoPronta}
            aria-describedby={!fotoPronta ? 'foto-obrigatoria' : undefined}
          >
            Continuar
          </button>
          <button type="button" className="botao botao-secundario" onClick={onVoltar}>
            Voltar
          </button>
        </>
      }
    >
      <input
        ref={inputRef}
        type="file"
        accept={TIPOS_ACEITOS.join(',')}
        capture="environment"
        onChange={aoEscolherArquivo}
        className="visualmente-oculto"
        tabIndex={-1}
        aria-hidden="true"
        data-testid="input-foto"
      />

      <p className="texto-apoio">Fotografe só o problema, sem rostos, placas ou fachadas.</p>

      {cameraAberta ? (
        <CameraAoVivo onCapturar={usarFoto} onErro={aoErroCamera} />
      ) : temFoto ? (
        <figure className="foto-preview">
          <img src={rascunho._fotoPreview} alt="Prévia da foto do problema" />
        </figure>
      ) : (
        <button type="button" className="area-camera" onClick={tirarFoto}>
          <span aria-hidden="true" className="area-camera-icone">📷</span>
          <span>Tirar foto</span>
        </button>
      )}

      <div role="status" aria-live="polite" className="status-envio">
        {enviando && 'Enviando a foto...'}
        {fotoPronta && 'Foto enviada.'}
      </div>

      {erro && (
        <div role="alert" className="mensagem-erro">
          <p>{erro}</p>
          {arquivo && !enviando && !cameraAberta && (
            <button type="button" className="botao botao-secundario" onClick={() => enviar(arquivo)}>
              Tentar enviar de novo
            </button>
          )}
        </div>
      )}

      {temFoto && !cameraAberta && (
        <button type="button" className="botao botao-texto" onClick={tirarFoto} disabled={enviando}>
          Tirar outra foto
        </button>
      )}

      {!usarCamera && !temFoto && (
        <button type="button" className="botao botao-secundario" onClick={escolherArquivo}>
          Enviar uma foto do aparelho
        </button>
      )}

      {!fotoPronta && !cameraAberta && (
        <p id="foto-obrigatoria" className="texto-apoio">
          A foto é obrigatória para registrar a ocorrência.
        </p>
      )}
    </Etapa>
  );
}
