import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapaOcorrencias.css";

const API_URL = process.env.REACT_APP_API_URL || "";
const BH_CENTER = [-19.9191, -43.9386];

// Ícone simples com as cores oficiais da identidade visual.
const occurrenceIcon = L.divIcon({
  className: "ru-marker-wrapper",
  html: '<span class="ru-marker"><span></span></span>',
  iconSize: [30, 38],
  iconAnchor: [15, 34],
  popupAnchor: [0, -32],
});

function getCoordinates(occurrence) {
  // GeoJSON guarda coordenadas na ordem [longitude, latitude].
  const geo = occurrence?.localizacao || occurrence?.localizacaoGeoJSON ||
    occurrence?.location || occurrence?.geometry;

  if (geo?.coordinates?.length >= 2) {
    return [Number(geo.coordinates[1]), Number(geo.coordinates[0])];
  }

  if (occurrence?.latitude != null && occurrence?.longitude != null) {
    return [Number(occurrence.latitude), Number(occurrence.longitude)];
  }

  if (occurrence?.lat != null && occurrence?.lng != null) {
    return [Number(occurrence.lat), Number(occurrence.lng)];
  }

  return null;
}

function getOccurrenceList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.ocorrencias)) return payload.ocorrencias;
  if (Array.isArray(payload?.features)) {
    return payload.features.map((feature) => ({
      ...feature.properties,
      localizacao: feature.geometry,
    }));
  }
  return [];
}

function BoundsWatcher({ onBoundsChange }) {
  const map = useMapEvents({
    moveend: () => onBoundsChange(map.getBounds()),
    zoomend: () => onBoundsChange(map.getBounds()),
  });

  useEffect(() => {
    onBoundsChange(map.getBounds());
  }, [map, onBoundsChange]);

  return null;
}

function ResizeMap() {
  const map = useMap();

  useEffect(() => {
    // Ajuda o Leaflet a recalcular o tamanho quando o layout móvel muda.
    const timer = window.setTimeout(() => map.invalidateSize(), 150);
    const recenter = () => map.setView(BH_CENTER, 13);
    window.addEventListener("ru-recenter-map", recenter);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("ru-recenter-map", recenter);
    };
  }, [map]);

  return null;
}

function formatLabel(value, fallback) {
  if (value == null || value === "") return fallback;
  return String(value)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/^\p{L}/u, (letter) => letter.toUpperCase());
}

export default function MapaOcorrencias() {
  const [ocorrencias, setOcorrencias] = useState([]);
  const [somenteAcessibilidade, setSomenteAcessibilidade] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [bounds, setBounds] = useState(null);

  const atualizarBounds = useCallback((mapBounds) => {
    const ne = mapBounds.getNorthEast();
    const sw = mapBounds.getSouthWest();
    setBounds({
      minLng: sw.lng,
      minLat: sw.lat,
      maxLng: ne.lng,
      maxLat: ne.lat,
    });
  }, []);

  const bbox = useMemo(() => {
    if (!bounds) return "";
    // Formato sugerido: minLng,minLat,maxLng,maxLat.
    return [
      bounds.minLng.toFixed(6),
      bounds.minLat.toFixed(6),
      bounds.maxLng.toFixed(6),
      bounds.maxLat.toFixed(6),
    ].join(",");
  }, [bounds]);

  useEffect(() => {
    if (!bbox) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setCarregando(true);
      setErro("");

      try {
        const params = new URLSearchParams({ bbox });
        if (somenteAcessibilidade) params.set("acessibilidade", "true");

        const response = await fetch(
          `${API_URL}/ocorrencias?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Não foi possível carregar as ocorrências (${response.status}).`);
        }

        const payload = await response.json();
        const list = getOccurrenceList(payload)
          .map((item) => ({ ...item, _coordinates: getCoordinates(item) }))
          .filter((item) =>
            item._coordinates &&
            Number.isFinite(item._coordinates[0]) &&
            Number.isFinite(item._coordinates[1])
          );

        setOcorrencias(list);
      } catch (error) {
        if (error.name !== "AbortError") {
          setErro(
            API_URL
              ? "Não foi possível conectar ao servidor. Confira se o backend está ativo."
              : "Configure VITE_API_URL para conectar o mapa ao backend."
          );
        }
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [bbox, somenteAcessibilidade]);

  const total = ocorrencias.length;

  return (
    <main className="ru-app">
      <header className="ru-header">
        <img
          className="ru-logo"
          src="/logo-report-urbano.png"
          alt="Report Urbano — Belo Horizonte mais acessível"
        />
        <div className="ru-header-copy">
          <span className="ru-eyebrow">MAPA COLABORATIVO</span>
          <h1>Ocorrências próximas</h1>
          <p>Veja barreiras de acessibilidade em Belo Horizonte.</p>
        </div>
      </header>

      <section className="ru-controls" aria-label="Filtros do mapa">
        <div className="ru-results" aria-live="polite">
          <span className="ru-results-dot" />
          <strong>{carregando ? "Atualizando…" : `${total} ${total === 1 ? "ocorrência" : "ocorrências"}`}</strong>
          <span>na área visível</span>
        </div>

        <label className="ru-toggle">
          <span className="ru-toggle-text">
            <strong>Acessibilidade</strong>
            <small>Mostrar barreiras relevantes</small>
          </span>
          <input
            type="checkbox"
            checked={somenteAcessibilidade}
            onChange={(event) => setSomenteAcessibilidade(event.target.checked)}
            aria-label="Filtrar ocorrências de acessibilidade"
          />
          <span className="ru-switch" aria-hidden="true" />
        </label>
      </section>

      {erro && (
        <div className="ru-error" role="status">
          <strong>Mapa sem conexão com o servidor</strong>
          <span>{erro}</span>
        </div>
      )}

      <section className="ru-map-section" aria-label="Mapa de ocorrências">
        <MapContainer
          center={BH_CENTER}
          zoom={13}
          minZoom={10}
          maxZoom={19}
          scrollWheelZoom
          className="ru-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <BoundsWatcher onBoundsChange={atualizarBounds} />
          <ResizeMap />

          {ocorrencias.map((ocorrencia, index) => {
            const coords = ocorrencia._coordinates;
            const key = ocorrencia.id || ocorrencia._id || `${coords.join(",")}-${index}`;
            return (
              <Marker
                key={key}
                position={coords}
                icon={occurrenceIcon}
              >
                <Popup>
                  <div className="ru-popup">
                    <strong>{formatLabel(ocorrencia.tipo || ocorrencia.categoria, "Barreira de acessibilidade")}</strong>
                    <span>{formatLabel(ocorrencia.gravidade, "Gravidade não informada")}</span>
                    <span className="ru-popup-status">
                      {formatLabel(ocorrencia.status, "Status não informado")}
                    </span>
                    {ocorrencia.descricao && <p>{ocorrencia.descricao}</p>}
                    {ocorrencia.endereco && <small>{ocorrencia.endereco}</small>}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        <div className="ru-map-legend">
          <span className="ru-legend-pin" />
          <span>Ocorrência registrada</span>
        </div>
        <button
          className="ru-recenter"
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("ru-recenter-map"))}
          aria-label="Voltar para Belo Horizonte"
          title="Voltar para Belo Horizonte"
        >
          ◎
        </button>
      </section>

      <footer className="ru-footer">
        <span className="ru-footer-icon" aria-hidden="true">⌖</span>
        <p><strong>Seu caminho importa.</strong><br />Confirme ocorrências e ajude a cidade a priorizar melhorias.</p>
      </footer>
    </main>
  );
}
