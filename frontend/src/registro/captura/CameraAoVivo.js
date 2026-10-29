import { useEffect, useRef, useState } from 'react';

const MENSAGENS_ERRO_CAMERA = {
  NotAllowedError: 'Você não liberou a câmera. Libere no cadeado ao lado do endereço do site ou envie uma foto do aparelho.',
  NotFoundError: 'Nenhuma câmera foi encontrada neste aparelho. Envie uma foto do aparelho.',
  NotReadableError: 'A câmera está sendo usada por outro aplicativo. Feche-o e tente de novo, ou envie uma foto do aparelho.',
};

export function cameraDisponivel() {
  return Boolean(navigator.mediaDevices?.getUserMedia);
}

export default function CameraAoVivo({ onCapturar, onErro }) {
  const videoRef = useRef(null);
  const [pronta, setPronta] = useState(false);

  useEffect(() => {
    let stream;
    let cancelado = false;

    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      })
      .then((s) => {
        stream = s;
        if (cancelado) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        videoRef.current.srcObject = s;
        return videoRef.current.play().then(() => !cancelado && setPronta(true));
      })
      .catch((e) => {
        if (!cancelado) onErro(MENSAGENS_ERRO_CAMERA[e.name] || 'Não foi possível abrir a câmera. Envie uma foto do aparelho.');
      });

    return () => {
      cancelado = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [onErro]);

  function capturar() {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (blob) onCapturar(new File([blob], `ocorrencia-${Date.now()}.jpg`, { type: 'image/jpeg' }));
      },
      'image/jpeg',
      0.85
    );
  }

  return (
    <div className="camera-ao-vivo">
      <video ref={videoRef} muted playsInline aria-label="Imagem da câmera" />
      <button type="button" className="botao botao-primario botao-capturar" onClick={capturar} disabled={!pronta}>
        {pronta ? 'Tirar foto' : 'Abrindo a câmera...'}
      </button>
    </div>
  );
}
