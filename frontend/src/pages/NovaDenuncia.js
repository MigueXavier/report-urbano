import {useEffect,useState} from 'react';import {useNavigate} from 'react-router-dom';import {useApp} from '../context/AppContext';import Mapa from '../components/Mapa';
import {Bar,Card,Chip,Seg,Row,Photo} from '../components/ui';import {TIPOS,PERFIS,CENTRO,dist} from '../data/mock';
export default function NovaDenuncia(){const {list,add}=useApp(),n=useNavigate();
 const [s,setS]=useState(1),[foto,setFoto]=useState(null),[pos,setPos]=useState(CENTRO),[f,setF]=useState({tipo:TIPOS[2],acess:true,perfis:[],grav:'Moderada',desc:''});
 const set=(k,v)=>setF(x=>({...x,[k]:v})),dups=list.filter(o=>dist(o.pos,pos)<=20); // RF19: raio de 20 m
 useEffect(()=>{navigator.geolocation?.getCurrentPosition(p=>setPos([p.coords.latitude,p.coords.longitude]))},[]);
 const next=()=>setS(s===2&&!dups.length?4:s+1),back=()=>s===1?n(-1):setS(s===4&&!dups.length?2:s-1);
 const end=`${pos[0].toFixed(5)}, ${pos[1].toFixed(5)}`;
 const send=()=>{if(!navigator.onLine)return n('/erro'); // RNF18
  add({...f,pos,foto,end,status:'Aberta',dias:0,conf:1,data:new Date().toLocaleDateString('pt-BR'),autor:'Você'});n('/mapa')};
 const T=['Foto da ocorrência','Confirme o local','Verificar duplicata','Classificar ocorrência','Confirmar envio'][s-1];
 return <main className="scr"><Bar title={`${s}/5 · ${T}`} back={false} right={<button className="ico" aria-label="Voltar" onClick={back}>←</button>}/>
 <div className="progress-track" aria-label={`Etapa ${s} de 5`}><span style={{width:`${s*20}%`}}/></div>{s===1&&<><Photo src={foto}/><label className="btn sec ln">{foto?'Trocar foto':'Tirar foto ou escolher da galeria'}
  <input hidden type="file" accept="image/*" capture="environment" onChange={e=>e.target.files[0]&&setFoto(URL.createObjectURL(e.target.files[0]))}/></label>
  <small>Evite fotografar pessoas, placas de veículos ou fachadas identificáveis.</small></>}
 {s===2&&<><Mapa pick={pos} onPick={setPos}/><small>Arraste o pino ou clique no mapa para ajustar o local.</small></>}
 {s===3&&<><h2>⚠ Foram detectadas {dups.length} denúncias próximas</h2><div className="grid">{dups.map(o=><Card key={o.id} o={o} onClick={()=>n('/ocorrencia/'+o.id)}/>)}</div></>}
 {s===4&&<><label>Tipo<select value={f.tipo} onChange={e=>set('tipo',e.target.value)}>{TIPOS.map(t=><option key={t}>{t}</option>)}</select></label>
  <label className="chk"><input type="checkbox" checked={f.acess} onChange={e=>set('acess',e.target.checked)}/> Impacta acessibilidade</label>
  {f.acess&&<><h2>Perfis afetados</h2><div className="chips">{PERFIS.map(p=><Chip key={p} on={f.perfis.includes(p)} onClick={()=>set('perfis',f.perfis.includes(p)?f.perfis.filter(x=>x!==p):[...f.perfis,p])}>{p}</Chip>)}</div></>}
  <h2>Gravidade</h2><Seg opts={['Leve','Moderada','Grave']} v={f.grav} set={v=>set('grav',v)}/>
  <label>Descrição (opcional)<textarea rows={3} value={f.desc} onChange={e=>set('desc',e.target.value)}/></label></>}
 {s===5&&<><Photo src={foto}/><div className="tbl"><Row k="Tipo" v={f.tipo}/><Row k="Gravidade" v={f.grav}/><Row k="Local" v={end}/><Row k="Descrição" v={f.desc||'—'}/></div></>}
 <div className="col foot">{s===3?<button className="btn" onClick={next}>Nenhum é o meu, continuar</button>
  :<button className="btn" disabled={s===1&&!foto} onClick={s===5?send:next}>{s===5?'Confirmar envio':s===2?'Confirmar local':'Continuar'}</button>}</div></main>}
