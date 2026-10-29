import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarMinhasOcorrencias } from "../services/ocorrenciaService";
import { rotuloTipo, rotuloGravidade, rotuloStatus, formatarData, plural } from "../utils/rotulos";
import "./Ocorrencias.css";

export default function MeuHistorico() {
  const [ocorrencias, setOcorrencias] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    listarMinhasOcorrencias()
      .then(setOcorrencias)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div className="pagina">
      <header className="topo">
        <h1>Minhas ocorrências</h1>
      </header>

      <main className="conteudo">
        {carregando && <p className="aviso" role="status">Carregando...</p>}
        {erro && <p className="aviso aviso-erro" role="alert">{erro}</p>}

        {!carregando && !erro && ocorrencias.length === 0 && (
          <p className="aviso">Você ainda não registrou nenhuma ocorrência.</p>
        )}

        {!carregando && !erro && ocorrencias.length > 0 && (
          <>
            <p className="resumo">{plural(ocorrencias.length, "ocorrência registrada", "ocorrências registradas")}</p>

            <ul className="lista">
              {ocorrencias.map((o) => (
                <li key={o.id}>
                  <Link to={`/ocorrencias/${o.id}`} className="card-item">
                    <div className={`faixa faixa-${o.gravidade?.toLowerCase()}`} aria-hidden="true" />
                    <div className="card-corpo">
                      <div className="card-linha">
                        <h2>{rotuloTipo(o.tipo)}</h2>
                        <span className={`selo selo-status-${o.status?.toLowerCase()}`}>{rotuloStatus(o.status)}</span>
                      </div>
                      <p className="card-info">
                        {rotuloGravidade(o.gravidade)} · Registrada em {formatarData(o.dataCriacao)}
                      </p>
                      <p className="card-info">
                        {plural(o.diasEmAberto, "dia", "dias")} em aberto · {plural(o.numeroConfirmacoes, "confirmação", "confirmações")}
                      </p>
                    </div>
                    <span className="seta" aria-hidden="true">›</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}
