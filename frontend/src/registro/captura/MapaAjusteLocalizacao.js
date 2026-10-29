import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconeRetina from 'leaflet/dist/images/marker-icon-2x.png';
import icone from 'leaflet/dist/images/marker-icon.png';
import sombra from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: iconeRetina, iconUrl: icone, shadowUrl: sombra });

function CliqueNoMapa({ onMover }) {
  useMapEvents({
    click: (evento) => onMover({ latitude: evento.latlng.lat, longitude: evento.latlng.lng }),
  });
  return null;
}

function Centralizar({ ponto, versao }) {
  const mapa = useMap();
  const pontoRef = useRef(ponto);
  pontoRef.current = ponto;

  useEffect(() => {
    const { latitude, longitude } = pontoRef.current;
    mapa.setView([latitude, longitude], Math.max(mapa.getZoom(), 17));
  }, [mapa, versao]);
  return null;
}

export default function MapaAjusteLocalizacao({ ponto, onMover, versaoCentro }) {
  const pinoRef = useRef(null);

  const eventosPino = useMemo(
    () => ({
      dragend() {
        const { lat, lng } = pinoRef.current.getLatLng();
        onMover({ latitude: lat, longitude: lng });
      },
    }),
    [onMover]
  );

  return (
    <MapContainer
      center={[ponto.latitude, ponto.longitude]}
      zoom={18}
      maxZoom={19}
      className="mapa-ajuste"
      aria-label="Mapa para ajustar o local da ocorrência"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <Marker
        position={[ponto.latitude, ponto.longitude]}
        draggable
        autoPan
        eventHandlers={eventosPino}
        ref={pinoRef}
        title="Local da ocorrência. Arraste para ajustar."
        alt="Pino do local da ocorrência"
      />
      <CliqueNoMapa onMover={onMover} />
      <Centralizar ponto={ponto} versao={versaoCentro} />
    </MapContainer>
  );
}
