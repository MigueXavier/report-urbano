import { useEffect, useRef } from 'react';

export default function Etapa({ titulo, passo, totalPassos, children, rodape }) {
  const tituloRef = useRef(null);

  useEffect(() => {
    tituloRef.current?.focus();
  }, []);

  return (
    <section className="etapa" aria-labelledby="etapa-titulo">
      {passo && (
        <p className="etapa-passo">
          Passo {passo} de {totalPassos}
        </p>
      )}
      <h1 id="etapa-titulo" ref={tituloRef} tabIndex={-1}>
        {titulo}
      </h1>
      <div className="etapa-conteudo">{children}</div>
      {rodape && <div className="etapa-rodape">{rodape}</div>}
    </section>
  );
}
