import {useNavigate} from 'react-router-dom';import {useApp} from '../context/AppContext';import {Bar,Card} from '../components/ui';
const Lista=({t,l,go})=><><h2>{t}</h2>{l.length?<div className="grid">{l.map(o=><Card key={o.id} o={o} onClick={go&&(()=>go(o))}/>)}</div>:<small>Nenhuma ocorrência.</small>}</>;
export function Atividade(){const {list,derr}=useApp(),n=useNavigate(),go=o=>n('/ocorrencia/'+o.id);
 return <main className="scr"><Bar title="Atividade"/><Lista t="Derrubados:" l={derr}/><Lista t="Resolvidos:" l={list.filter(o=>o.status==='Resolvida')} go={go}/></main>}
export function Fila(){const {list,fila}=useApp(),n=useNavigate();
 return <main className="scr"><Bar title="Fila de moderação"/><Lista t="Denúncias recebidas:" l={list.filter(o=>fila.includes(o.id))} go={o=>n('/ocorrencia/'+o.id)}/></main>}
