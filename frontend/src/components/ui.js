import {useRef} from 'react';
import {useNavigate} from 'react-router-dom';
export const Bar=({title,back=true,right})=>{const n=useNavigate();return <header className="bar">{back&&<button className="ico" aria-label="Voltar" onClick={()=>n(-1)}>←</button>}<h1>{title}</h1>{right}</header>};
export const Dialog=({text,onYes,onNo})=><div className="ov" role="dialog" aria-modal="true"><div className="dlg"><p>{text}</p><b>Continuar?</b><div className="row"><button className="btn" onClick={onYes}>Sim</button><button className="btn sec" onClick={onNo}>Não</button></div></div></div>;
export const Chip=({on,...p})=><button type="button" aria-pressed={on} className={'chip'+(on?' on':'')} {...p}/>;
export const Seg=({opts,v,set})=><div className="seg" role="group">{opts.map(o=><button type="button" key={o} aria-pressed={v===o} className={v===o?'on':''} onClick={()=>set(o)}>{o}</button>)}</div>;
// Escolha única em botões (RF07/RF08/RF10). Usa role="radiogroup" com tabindex móvel e navegação por setas (RNF13/RNF14).
export const Escolha=({opts,v,set,label,cls='chips',chip=true})=>{
 const grupo=useRef(null);
 const foco=i=>grupo.current?.querySelectorAll('[role="radio"]')[i]?.focus();
 const teclado=e=>{const d={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[e.key];if(!d)return;
  e.preventDefault();const atual=opts.indexOf(v),i=((atual<0?0:atual+d)+opts.length)%opts.length;set(opts[i]);foco(i)};
 return <div ref={grupo} className={cls} role="radiogroup" aria-label={label} onKeyDown={teclado}>
  {opts.map((o,i)=><button type="button" key={o} role="radio" aria-checked={v===o}
   tabIndex={v===o||(v==null&&i===0)?0:-1} className={(chip?'chip':'')+(v===o?' on':'')}
   onClick={()=>set(o)}>{o}</button>)}</div>};
export const Badge=({s})=><span className={'bd '+(s==='Aberta'?'op':'ok')}>{s}</span>;
export const Card=({o,onClick})=><button className="card" onClick={onClick}><div className={'th'+(o.acess?' accessible':'')}>{o.foto?<img src={o.foto} alt=""/>:<span aria-hidden="true">{o.acess?'◎':'!'}</span>}</div><div className="card-content"><Badge s={o.status}/><b>{o.tipo}</b><small>{o.end}</small><small>{o.conf} confirmações · {o.dias} dias</small></div><span className="card-arrow" aria-hidden="true">›</span></button>;
export const Row=({k,v})=><div className="rw"><span>{k}</span><b>{v}</b></div>;
export const F=({l,...p})=><label>{l}<input {...p}/></label>;
export const Photo=({src})=>src?<img className="ph" src={src} alt="Foto da ocorrência"/>:<div className="ph placeholder" role="img" aria-label="Sem foto"><span>＋</span><small>Nenhuma foto adicionada</small></div>;
