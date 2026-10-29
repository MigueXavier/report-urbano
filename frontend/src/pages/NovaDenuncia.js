import {useEffect,useState} from 'react';import {useNavigate} from 'react-router-dom';import {useApp} from '../context/AppContext';import Mapa from '../components/Mapa';
import {Bar,Card,Chip,Escolha,Row,Photo} from '../components/ui';import {TIPOS,PERFIS,GRAVIDADES,DESC_MAX,CENTRO,dist} from '../data/mock';
export default function NovaDenuncia(){const {list,add}=useApp(),n=useNavigate();
 // RF07–RF11: classificação começa vazia, sem opção pré-marcada, para não gravar valor que o usuário não escolheu.
 const [s,setS]=useState(1),[foto,setFoto]=useState(null),[pos,setPos]=useState(CENTRO),[f,setF]=useState({tipo:null,acess:null,perfis:[],grav:null,desc:''});
 const set=(k,v)=>setF(x=>({...x,[k]:v})),dups=list.filter(o=>dist(o.pos,pos)<=20); // RF19: raio de 20 m
 useEffect(()=>{navigator.geolocation?.getCurrentPosition(p=>setPos([p.coords.latitude,p.coords.longitude]))},[]);
 const next=()=>setS(s===2&&!dups.length?4:s+1),back=()=>s===1?n(-1):setS(s===4&&!dups.length?2:s-1);
 const end=`${pos[0].toFixed(5)}, ${pos[1].toFixed(5)}`;
 // RF08: responder "Não" descarta os perfis já marcados, senão iriam no envio sem impacto declarado.
 const setAcess=v=>setF(x=>({...x,acess:v==='Sim',perfis:v==='Sim'?x.perfis:[]}));
 const perfil=p=>set('perfis',f.perfis.includes(p)?f.perfis.filter(x=>x!==p):[...f.perfis,p]); // RF09
 const falta=[!f.tipo&&'o tipo',f.acess==null&&'o impacto em acessibilidade',
  f.acess===true&&!f.perfis.length&&'pelo menos um perfil afetado',!f.grav&&'a gravidade'].filter(Boolean);
 const listaFalta=falta.join(', ').replace(/,([^,]*)$/,' e$1');
 const send=()=>{if(!navigator.onLine)return n('/erro'); // RNF18
  add({...f,pos,foto,end,status:'Aberta',dias:0,conf:1,data:new Date().toLocaleDateString('pt-BR'),autor:'Você'});n('/mapa')};
 const T=['Foto da ocorrência','Confirme o local','Verificar duplicata','Classificar ocorrência','Confirmar envio'][s-1];
 return <main className="scr"><Bar title={`${s}/5 · ${T}`} back={false} right={<button className="ico" aria-label="Voltar" onClick={back}>←</button>}/>
 <div className="progress-track" aria-label={`Etapa ${s} de 5`}><span style={{width:`${s*20}%`}}/></div>{s===1&&<><Photo src={foto}/><label className="btn sec ln">{foto?'Trocar foto':'Tirar foto ou escolher da galeria'}
  <input hidden type="file" accept="image/*" capture="environment" onChange={e=>e.target.files[0]&&setFoto(URL.createObjectURL(e.target.files[0]))}/></label>
  <small>Evite fotografar pessoas, placas de veículos ou fachadas identificáveis.</small></>}
 {s===2&&<><Mapa pick={pos} onPick={setPos}/><small>Arraste o pino ou clique no mapa para ajustar o local.</small></>}
 {s===3&&<><h2>⚠ Foram detectadas {dups.length} denúncias próximas</h2><div className="grid">{dups.map(o=><Card key={o.id} o={o} onClick={()=>n('/ocorrencia/'+o.id)}/>)}</div></>}
 {s===4&&<>
  <div className="field"><h2>Tipo de ocorrência</h2>{/* RF07 */}
   <Escolha label="Tipo de ocorrência" cls="chips tipos" opts={TIPOS} v={f.tipo} set={v=>set('tipo',v)}/></div>
  <div className="field"><h2>Impacta a acessibilidade?</h2>{/* RF08 */}
   <Escolha label="Impacta a acessibilidade?" cls="seg" chip={false} opts={['Sim','Não']}
    v={f.acess==null?null:f.acess?'Sim':'Não'} set={setAcess}/>
   <small>Responda "Sim" se a ocorrência impede ou dificulta a passagem de alguém.</small></div>
  {f.acess===true&&<div className="field"><h2>Perfis afetados</h2>{/* RF09 */}
   <div className="chips" role="group" aria-label="Perfis afetados">
    {PERFIS.map(p=><Chip key={p} on={f.perfis.includes(p)} onClick={()=>perfil(p)}>{p}</Chip>)}</div>
   <small>Marque todos os perfis que a ocorrência atinge.</small></div>}
  <div className="field"><h2>Gravidade</h2>{/* RF10 */}
   <Escolha label="Gravidade" cls="seg" chip={false} opts={GRAVIDADES} v={f.grav} set={v=>set('grav',v)}/></div>
  <label>Descrição (opcional){/* RF11 */}
   <textarea rows={3} maxLength={DESC_MAX} value={f.desc} aria-describedby="desc-ajuda" onChange={e=>set('desc',e.target.value)}/></label>
  <div className="field-foot"><small id="desc-ajuda">Nenhum campo de texto é obrigatório.</small>
   <small>{f.desc.length}/{DESC_MAX}</small></div></>}
 {s===5&&<><Photo src={foto}/><div className="tbl"><Row k="Tipo" v={f.tipo}/><Row k="Impacta acessibilidade" v={f.acess?'Sim':'Não'}/>
  {f.acess&&<Row k="Perfis afetados" v={f.perfis.join(', ')}/>}<Row k="Gravidade" v={f.grav}/><Row k="Local" v={end}/><Row k="Descrição" v={f.desc||'—'}/></div></>}
 <div className="col foot">{s===4&&falta.length>0&&<p className="hint" role="status">Para continuar, informe {listaFalta}.</p>}
 {s===3?<button className="btn" onClick={next}>Nenhum é o meu, continuar</button>
  :<button className="btn" disabled={(s===1&&!foto)||(s===4&&falta.length>0)} onClick={s===5?send:next}>{s===5?'Confirmar envio':s===2?'Confirmar local':'Continuar'}</button>}</div></main>}
