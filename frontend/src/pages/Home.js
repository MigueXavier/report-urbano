import {useState} from 'react';import {useNavigate} from 'react-router-dom';import {useApp} from '../context/AppContext';import Mapa from '../components/Mapa';import {Card} from '../components/ui';
export default function Home(){const {user,list}=useApp(),n=useNavigate(),mod=user.role==='moderador',[sa,setSa]=useState(false);
 const pins=list.filter(o=>!sa||o.acess);
 return <main className="scr"><header className="bar"><button className="ico" aria-label="Perfil" onClick={()=>n('/perfil')}>👤</button>
 <h1>{mod?'Últimas denúncias na sua área':'Encontrar denúncias próximas'}</h1></header>
 {mod?<div className="grid">{list.map(o=><Card key={o.id} o={o} onClick={()=>n('/ocorrencia/'+o.id)}/>)}</div>:<>
 <label className="chk"><input type="checkbox" checked={sa} onChange={e=>setSa(e.target.checked)}/> Só ocorrências que impactam acessibilidade</label>
 <Mapa pins={pins} onPin={o=>n('/ocorrencia/'+o.id)}/></>}
 <div className="col foot">{!mod&&<button className="btn" onClick={()=>n('/nova')}>＋ Nova denúncia</button>}<button className="btn sec" onClick={()=>n('/painel')}>Painel público</button></div></main>}
