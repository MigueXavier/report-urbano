import {useRef} from 'react';
import {useNavigate} from 'react-router-dom';

// Barra de titulo que aparece no topo das telas
export function Bar({title, back = true, right}) {
  const navegar = useNavigate();

  return (
    <header className="bar">
      {back && (
        <button className="ico" aria-label="Voltar" onClick={() => navegar(-1)}>←</button>
      )}
      <h1>{title}</h1>
      {right}
    </header>
  );
}

// Caixa de confirmacao com as opcoes Sim e Nao
export function Dialog({text, onYes, onNo}) {
  return (
    <div className="ov" role="dialog" aria-modal="true">
      <div className="dlg">
        <p>{text}</p>
        <b>Continuar?</b>
        <div className="row">
          <button className="btn" onClick={onYes}>Sim</button>
          <button className="btn sec" onClick={onNo}>Não</button>
        </div>
      </div>
    </div>
  );
}

// Botao que fica marcado ou desmarcado, usado nos perfis afetados (RF09)
export function Chip({on, ...resto}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      className={'chip' + (on ? ' on' : '')}
      {...resto}
    />
  );
}

// Grupo de botoes lado a lado
export function Seg({opts, v, set}) {
  return (
    <div className="seg" role="group">
      {opts.map(function (opcao) {
        return (
          <button
            type="button"
            key={opcao}
            aria-pressed={v === opcao}
            className={v === opcao ? 'on' : ''}
            onClick={() => set(opcao)}
          >
            {opcao}
          </button>
        );
      })}
    </div>
  );
}

// Escolha de uma opcao so, usada no tipo, no impacto e na gravidade (RF07/RF08/RF10).
// Usa role="radiogroup" e navegacao pelas setas do teclado por causa do
// leitor de tela (RNF13/RNF14).
export function Escolha({opts, v, set, label, cls = 'chips', chip = true}) {
  const grupo = useRef(null);

  // Coloca o foco no botao da posicao indicada
  function focar(posicao) {
    if (grupo.current) {
      const botoes = grupo.current.querySelectorAll('[role="radio"]');
      if (botoes[posicao]) {
        botoes[posicao].focus();
      }
    }
  }

  function aoApertarTecla(evento) {
    let passo = 0;

    if (evento.key === 'ArrowRight' || evento.key === 'ArrowDown') {
      passo = 1;
    }
    if (evento.key === 'ArrowLeft' || evento.key === 'ArrowUp') {
      passo = -1;
    }

    // Se apertou qualquer outra tecla, nao faz nada
    if (passo === 0) {
      return;
    }

    evento.preventDefault();

    const atual = opts.indexOf(v);
    let proxima;

    if (atual < 0) {
      // Nada marcado ainda, entao comeca pela primeira opcao
      proxima = 0;
    } else {
      // O resto da divisao faz a lista dar a volta no inicio e no fim
      proxima = (atual + passo + opts.length) % opts.length;
    }

    set(opts[proxima]);
    focar(proxima);
  }

  return (
    <div
      ref={grupo}
      className={cls}
      role="radiogroup"
      aria-label={label}
      onKeyDown={aoApertarTecla}
    >
      {opts.map(function (opcao, posicao) {
        const marcada = v === opcao;
        // Se ainda nao tem nada marcado, o Tab entra pela primeira opcao
        const primeiraDeTodas = v == null && posicao === 0;

        return (
          <button
            type="button"
            key={opcao}
            role="radio"
            aria-checked={marcada}
            tabIndex={marcada || primeiraDeTodas ? 0 : -1}
            className={(chip ? 'chip' : '') + (marcada ? ' on' : '')}
            onClick={() => set(opcao)}
          >
            {opcao}
          </button>
        );
      })}
    </div>
  );
}

// Etiqueta de status da ocorrencia
export function Badge({s}) {
  return <span className={'bd ' + (s === 'Aberta' ? 'op' : 'ok')}>{s}</span>;
}

// Cartao de uma ocorrencia na lista e no mapa
export function Card({o, onClick}) {
  return (
    <button className="card" onClick={onClick}>
      <div className={'th' + (o.acess ? ' accessible' : '')}>
        {o.foto ? (
          <img src={o.foto} alt="" />
        ) : (
          <span aria-hidden="true">{o.acess ? '◎' : '!'}</span>
        )}
      </div>

      <div className="card-content">
        <Badge s={o.status} />
        <b>{o.tipo}</b>
        <small>{o.end}</small>
        <small>{o.conf} confirmações · {o.dias} dias</small>
      </div>

      <span className="card-arrow" aria-hidden="true">›</span>
    </button>
  );
}

// Linha de "rotulo: valor" usada nas tabelas de resumo
export function Row({k, v}) {
  return (
    <div className="rw">
      <span>{k}</span>
      <b>{v}</b>
    </div>
  );
}

// Campo de formulario com o rotulo em cima
export function F({l, ...resto}) {
  return (
    <label>
      {l}
      <input {...resto} />
    </label>
  );
}

// Mostra a foto da ocorrencia ou um espaco vazio quando ainda nao tem foto
export function Photo({src}) {
  if (src) {
    return <img className="ph" src={src} alt="Foto da ocorrência" />;
  }

  return (
    <div className="ph placeholder" role="img" aria-label="Sem foto">
      <span>＋</span>
      <small>Nenhuma foto adicionada</small>
    </div>
  );
}
