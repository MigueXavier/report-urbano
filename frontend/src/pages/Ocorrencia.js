import {useState} from 'react';import {useNavigate,useParams,Navigate} from 'react-router-dom';import {useApp} from '../context/AppContext';import {Bar,Dialog,Photo,Row,Badge} from '../components/ui';
export default function Ocorrencia(){const {id}=useParams(),{user,list,upd,denunciar,derrubar}=useApp(),n=useNavigate(),o=list.find(x=>String(x.id)===id),[d,setD]=useState(null),[msg,setMsg]=useState('');
 if(!o)return <Navigate to="/mapa" replace/>;const mod=user.role==='moderador';
 const yes=()=>{if(d==='res'){const r=(o.res||0)+1;upd(o.id,()=>({res:r,...(r>=2&&{status:'Resolvida'})}));setMsg('Obrigado! A resolução precisa de mais de uma confirmação independente.')} // RF23
  else if(mod){derrubar(o.id);return n('/mapa')}else{denunciar(o.id);setMsg('Denúncia enviada para moderação.')}setD(null)};
 return <main className="scr"><Bar title={o.tipo}/><Photo src={o.foto}/>
 <div className="tbl"><Row k="Status" v={<Badge s={o.status}/>}/><Row k="Gravidade" v={o.grav}/><Row k="Registrado em" v={o.data}/><Row k="Dias em aberto" v={o.dias}/><Row k="Confirmações" v={o.conf}/><Row k="Endereço" v={o.end}/></div>
 <p role="status">{msg}</p>
 <div className="col foot">{!mod&&<button className="btn" disabled={o.jaConf} onClick={()=>upd(o.id,x=>({conf:x.conf+1,jaConf:true}))}>{o.jaConf?'Você já confirmou':'Confirmar denúncia'}</button>} {/* RF17/RF18 */}
 <div className="row"><button className="btn ok" onClick={()=>setD('res')}>Confirmar resolução</button><button className="btn dan" onClick={()=>setD('del')}>Derrubar</button></div></div>
 {d&&<Dialog text={d==='res'?'Ao confirmar a resolução você se compromete a afirmar que a situação foi resolvida.':'Ao derrubar essa denúncia você se compromete a confirmar que ela é caluniosa.'} onYes={yes} onNo={()=>setD(null)}/>}</main>}
