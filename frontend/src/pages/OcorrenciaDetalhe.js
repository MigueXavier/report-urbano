import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { buscarOcorrencia } from "../services/ocorrenciaService";
import { rotuloTipo, rotuloPerfil, rotuloGravidade, rotuloStatus, formatarData } from "../utils/rotulos";
import "./Ocorrencias.css";

export default function OcorrenciaDetalhe() {
  const { id } = useParams();
  const [ocorrencia, setOcorrencia] = useState(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarOcorrencia(id)
      .then(setOcorrencia)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, [id]);

  return (
    <div className="pagina">
      <header className="topo">
        <Link to="/historico" className="voltar" aria-label="Voltar para minhas ocorrências">‹</Link>
        <h1>Detalhe da ocorrência</h1>
      </header>

      <main className="conteudo">
        {carregando && <p className="aviso" role="status">Carregando...</p>}
        {erro && <p className="aviso aviso-erro" role="alert">{erro}</p>}

        {ocorrencia && (
          <>
            {ocorrencia.fotoUrl ? (
              <img className="foto" src={ocorrencia.fotoUrl} alt={`Foto da ocorrência: ${rotuloTipo(ocorrencia.tipo)}`} />
            ) : (
              <div className="foto foto-vazia">Sem foto disponível</div>
            )}

            <section className="bloco">
              <h2 className="titulo">{rotuloTipo(ocorrencia.tipo)}</h2>
              <div className="selos">
                <span className={`selo selo-status-${ocorrencia.status?.toLowerCase()}`}>{rotuloStatus(ocorrencia.status)}</span>
                <span className={`selo selo-${ocorrencia.gravidade?.toLowerCase()}`}>{rotuloGravidade(ocorrencia.gravidade)}</span>
              </div>
            </section>

            <section className="numeros" aria-label="Situação da ocorrência">
              <div className="numero">
                <strong>{ocorrencia.diasEmAberto}</strong>
                <span>{ocorrencia.diasEmAberto === 1 ? "dia em aberto" : "dias em aberto"}</span>
              </div>
              <div className="numero">
                <strong>{ocorrencia.numeroConfirmacoes}</strong>
                <span>{ocorrencia.numeroConfirmacoes === 1 ? "confirmação" : "confirmações"}</span>
              </div>
            </section>

            <section className="bloco">
              <h3>Acessibilidade</h3>
              {ocorrencia.impactoAcessibilidade ? (
                <>
                  <p>Dificulta a passagem de:</p>
                  <ul className="chips">
                    {ocorrencia.perfisAfetados.map((perfil) => (
                      <li key={perfil} className="chip">{rotuloPerfil(perfil)}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>Sem impacto em acessibilidade informado.</p>
              )}
            </section>

            {ocorrencia.descricao && (
              <section className="bloco">
                <h3>Descrição</h3>
                <p>{ocorrencia.descricao}</p>
              </section>
            )}

            <section className="bloco">
              <h3>Informações</h3>
              <dl className="dados">
                <dt>Registrada em</dt>
                <dd>{formatarData(ocorrencia.dataCriacao)}</dd>
                <dt>Cidade</dt>
                <dd>{ocorrencia.cidade}</dd>
                <dt>Localização</dt>
                <dd>{ocorrencia.latitude.toFixed(4)}, {ocorrencia.longitude.toFixed(4)}</dd>
                <dt>Autor</dt>
                <dd>{ocorrencia.autorId ? ocorrencia.autorId : "Anônimo"}</dd>
              </dl>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
