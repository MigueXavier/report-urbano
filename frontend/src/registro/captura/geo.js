export const CENTRO_BH = { latitude: -19.919, longitude: -43.9386 };

export function distanciaEmMetros(a, b) {
  const raioTerra = 6371000;
  const rad = (graus) => (graus * Math.PI) / 180;
  const dLat = rad(b.latitude - a.latitude);
  const dLon = rad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * raioTerra * Math.asin(Math.sqrt(h));
}

const MENSAGENS_ERRO_GPS = {
  1: 'Você não liberou a localização. Libere no cadeado ao lado do endereço do site ou marque o local no mapa.',
  2: 'Não conseguimos achar sua localização. Vá para um lugar mais aberto e tente de novo, ou marque o local no mapa.',
  3: 'O GPS demorou para responder. Tente de novo ou marque o local no mapa.',
};

export function lerPosicaoAtual() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Este navegador não informa a localização. Marque o local no mapa.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        resolve({
          latitude: coords.latitude,
          longitude: coords.longitude,
          precisao: Math.round(coords.accuracy),
        }),
      (erro) => reject(new Error(MENSAGENS_ERRO_GPS[erro.code] || MENSAGENS_ERRO_GPS[2])),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 30000 }
    );
  });
}
