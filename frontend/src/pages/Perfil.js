import {useNavigate} from 'react-router-dom';import {useApp} from '../context/AppContext';import {Bar,Card,F} from '../components/ui';
export function Perfil(){const {user,setUser,fila}=useApp(),n=useNavigate(),mod=user.role==='moderador';
 return <main className="scr"><Bar title={user.nome}/><p>{user.email}{mod&&<> <span className="bd op">Moderador</span></>}</p>
 <button className="btn sec" onClick={()=>n(mod?'/atividade':'/historico')}>{mod?'Minha atividade':'Meu histórico de denúncias'} ›</button>
 <button className="btn sec" onClick={()=>n('/perfil/editar')}>Editar dados da conta ›</button>
 {mod&&<button className="btn sec" onClick={()=>n('/fila')}>Fila de moderação {fila.length>0&&<span className="bd op">{fila.length}</span>} ›</button>}
 <button className="btn dan" onClick={()=>{setUser(null);n('/')}}>Sair</button></main>}
export function Editar(){const {user}=useApp();return <main className="scr"><Bar title="Editar dados"/><F l="Alterar e-mail" type="email" defaultValue={user.email}/><button className="btn sec">Alterar senha</button><button className="btn">Salvar</button></main>}
export function Historico(){const {list}=useApp(),n=useNavigate();
 return <main className="scr"><Bar title="Histórico de denúncias"/><div className="grid">{list.filter(o=>o.autor==='Você').map(o=><Card key={o.id} o={o} onClick={()=>n('/ocorrencia/'+o.id)}/>)}</div></main>}
