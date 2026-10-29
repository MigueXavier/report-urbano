import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { RascunhoOcorrenciaProvider, RASCUNHO_VAZIO, paraRequisicao } from './RascunhoOcorrenciaContext';
import RegistroOcorrencia from './RegistroOcorrencia';

jest.mock('./captura/MapaAjusteLocalizacao', () => ({ ponto, onMover }) => (
  <button type="button" onClick={() => onMover({ latitude: ponto.latitude + 0.01, longitude: ponto.longitude })}>
    arrastar pino
  </button>
));

const POSICAO_GPS = { coords: { latitude: -19.92, longitude: -43.94, accuracy: 8.4 } };

async function renderizar() {
  let resultado;
  await act(async () => {
    resultado = render(
      <RascunhoOcorrenciaProvider>
        <RegistroOcorrencia />
      </RascunhoOcorrenciaProvider>
    );
  });
  return resultado;
}

function fotoJpeg() {
  return new File([new Uint8Array([0xff, 0xd8, 0xff])], 'rua.jpg', { type: 'image/jpeg' });
}

let getCurrentPosition;

beforeEach(() => {
  window.localStorage.clear();
  getCurrentPosition = jest.fn((sucesso) => sucesso(POSICAO_GPS));
  Object.defineProperty(navigator, 'geolocation', { value: { getCurrentPosition }, configurable: true });
  URL.createObjectURL = jest.fn(() => 'blob:previa');
  URL.revokeObjectURL = jest.fn();
  global.fetch = jest.fn(async () => ({
    ok: true,
    json: async () => ({ fotoUrl: 'http://localhost:8080/uploads/fotos/abc.jpg' }),
  }));
});

test('fluxo completo da captura: consentimento, foto e ajuste do pino', async () => {
  await renderizar();

  expect(getCurrentPosition).not.toHaveBeenCalled();
  await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Concordo e quero continuar' })));
  await waitFor(() => expect(getCurrentPosition).toHaveBeenCalledTimes(1));

  expect(screen.getByRole('heading', { name: 'Foto do problema' })).toBeInTheDocument();
  expect(screen.getByText(/sem rostos, placas ou fachadas/)).toBeInTheDocument();

  const continuar = screen.getByRole('button', { name: 'Continuar' });
  expect(continuar).toBeDisabled();
  fireEvent.change(screen.getByTestId('input-foto'), { target: { files: [fotoJpeg()] } });
  expect(await screen.findByText('Foto enviada.')).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/uploads/fotos', expect.objectContaining({ method: 'POST' }));
  expect(continuar).toBeEnabled();
  fireEvent.click(continuar);

  expect(screen.getByText(/Pino na sua localização \(precisão de cerca de 8 m\)/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'arrastar pino' }));
  expect(screen.getByText(/Pino a \d+ m de onde você está/)).toBeInTheDocument();
  expect(screen.getByText(/O pino está longe/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Voltar o pino para minha localização' }));
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar local' }));

  const json = JSON.parse(screen.getByText(/fotoUrl/).textContent);
  expect(json).toMatchObject({
    fotoUrl: 'http://localhost:8080/uploads/fotos/abc.jpg',
    latitude: -19.92,
    longitude: -43.94,
    autorPublico: false,
  });
  expect(json).not.toHaveProperty('_fotoPreview');
});

test('quem já consentiu vai direto para a foto', async () => {
  window.localStorage.setItem('reportUrbano.consentimentoCaptura.v2', 'sim');
  await renderizar();
  expect(screen.getByRole('heading', { name: 'Foto do problema' })).toBeInTheDocument();
});

test('recusar o consentimento explica e não pede permissões', async () => {
  await renderizar();
  fireEvent.click(screen.getByRole('button', { name: 'Agora não' }));
  expect(screen.getByRole('heading', { name: /Sem câmera e localização/ })).toBeInTheDocument();
  expect(getCurrentPosition).not.toHaveBeenCalled();
});

test('falha no upload mostra o erro e permite tentar de novo', async () => {
  global.fetch = jest
    .fn()
    .mockRejectedValueOnce(new TypeError('Failed to fetch'))
    .mockResolvedValueOnce({ ok: true, json: async () => ({ fotoUrl: 'http://x/f.jpg' }) });
  window.localStorage.setItem('reportUrbano.consentimentoCaptura.v2', 'sim');
  await renderizar();
  fireEvent.change(screen.getByTestId('input-foto'), { target: { files: [fotoJpeg()] } });
  expect(await screen.findByRole('alert')).toHaveTextContent(/Verifique sua conexão/);
  expect(screen.getByRole('button', { name: 'Continuar' })).toBeDisabled();

  fireEvent.click(screen.getByRole('button', { name: 'Tentar enviar de novo' }));
  expect(await screen.findByText('Foto enviada.')).toBeInTheDocument();
});

test('recusa arquivo que não é foto sem enviar', async () => {
  window.localStorage.setItem('reportUrbano.consentimentoCaptura.v2', 'sim');
  await renderizar();
  const pdf = new File(['x'], 'doc.pdf', { type: 'application/pdf' });
  fireEvent.change(screen.getByTestId('input-foto'), { target: { files: [pdf] } });
  expect(screen.getByRole('alert')).toHaveTextContent('Formato não aceito');
  expect(global.fetch).not.toHaveBeenCalled();
});

test('GPS negado oferece marcar no mapa', async () => {
  getCurrentPosition.mockImplementation((_, erro) => erro({ code: 1 }));
  window.localStorage.setItem('reportUrbano.consentimentoCaptura.v2', 'sim');
  await renderizar();
  fireEvent.change(screen.getByTestId('input-foto'), { target: { files: [fotoJpeg()] } });
  await screen.findByText('Foto enviada.');
  fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));

  expect(screen.getByRole('alert')).toHaveTextContent('Você não liberou a localização');
  await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Marcar no mapa' })));
  expect(screen.getByText('Local marcado manualmente no mapa.')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Confirmar local' })).toBeEnabled();
});

test('abre a câmera na tela e usa a foto capturada', async () => {
  const parar = jest.fn();
  Object.defineProperty(navigator, 'mediaDevices', {
    configurable: true,
    value: { getUserMedia: jest.fn(async () => ({ getTracks: () => [{ stop: parar }] })) },
  });
  jest.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage: jest.fn() });
  jest.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((cb) => cb(new Blob(['x'], { type: 'image/jpeg' })));
  window.localStorage.setItem('reportUrbano.consentimentoCaptura.v2', 'sim');

  try {
    await renderizar();
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith(
      expect.objectContaining({ video: expect.objectContaining({ facingMode: { ideal: 'environment' } }) })
    );
    const capturar = await screen.findByRole('button', { name: 'Tirar foto' });
    fireEvent.click(capturar);

    expect(await screen.findByText('Foto enviada.')).toBeInTheDocument();
    expect(screen.getByAltText('Prévia da foto do problema')).toBeInTheDocument();
    expect(parar).toHaveBeenCalled();
    const enviado = global.fetch.mock.calls[0][1].body.get('foto');
    expect(enviado.type).toBe('image/jpeg');
  } finally {
    delete navigator.mediaDevices;
    jest.restoreAllMocks();
  }
});

test('câmera bloqueada oferece enviar uma foto do aparelho', async () => {
  const negado = Object.assign(new Error('negado'), { name: 'NotAllowedError' });
  Object.defineProperty(navigator, 'mediaDevices', {
    configurable: true,
    value: { getUserMedia: jest.fn(async () => { throw negado; }) },
  });
  window.localStorage.setItem('reportUrbano.consentimentoCaptura.v2', 'sim');

  try {
    await renderizar();
    expect(await screen.findByRole('alert')).toHaveTextContent('Você não liberou a câmera');
    expect(screen.getByRole('button', { name: 'Enviar uma foto do aparelho' })).toBeInTheDocument();
  } finally {
    delete navigator.mediaDevices;
  }
});

test('paraRequisicao tira os campos internos do front', () => {
  const corpo = paraRequisicao({ ...RASCUNHO_VAZIO, _fotoPreview: 'blob:x', fotoUrl: 'u' });
  expect(Object.keys(corpo).some((k) => k.startsWith('_'))).toBe(false);
  expect(corpo.fotoUrl).toBe('u');
});
