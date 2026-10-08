import {useState} from 'react';
import {useNavigate} from 'react-router-dom';import {useApp} from '../context/AppContext';import {Bar,Card,F} from '../components/ui';
export function Perfil(){const {user,setUser,fila}=useApp(),n=useNavigate(),mod=user.role==='moderador';
 return <main className="scr"><Bar title={user.nome}/><p>{user.email}{mod&&<> <span className="bd op">Moderador</span></>}</p>
 <button className="btn sec" onClick={()=>n(mod?'/atividade':'/historico')}>{mod?'Minha atividade':'Meu histórico de denúncias'} ›</button>
 <button className="btn sec" onClick={()=>n('/perfil/editar')}>Editar dados da conta ›</button>
 {mod&&<button className="btn sec" onClick={()=>n('/fila')}>Fila de moderação {fila.length>0&&<span className="bd op">{fila.length}</span>} ›</button>}
 <button className="btn dan" onClick={()=>{setUser(null);n('/')}}>Sair</button></main>}
export function Editar(){const {user,setUser}=useApp(),[nome,setNome]=useState(user.nome),[email,setEmail]=useState(user.email),[msg,setMsg]=useState('');return <main className="scr"><Bar title="Editar dados"/><p className="muted">Atualize como você aparece nesta demonstração.</p><form className="col" onSubmit={e=>{e.preventDefault();if(!nome.trim())return setMsg('Informe seu nome.');setUser({...user,nome:nome.trim(),email});setMsg('Dados atualizados nesta sessão.')}}><F l="Nome" value={nome} onChange={e=>setNome(e.target.value)} required/><F l="E-mail" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/><button className="btn">Salvar alterações</button><p role="status">{msg}</p></form><p className="demo-note">Alteração de senha será disponibilizada com a integração de autenticação.</p></main>}
export function Historico(){const {list}=useApp(),n=useNavigate();
 return <main className="scr"><Bar title="Histórico de denúncias"/>{!list.some(o=>o.autor==='Você')&&<p className="empty">Você ainda não registrou ocorrências.</p>}<div className="grid">{list.filter(o=>o.autor==='Você').map(o=><Card key={o.id} o={o} onClick={()=>n('/ocorrencia/'+o.id)}/>)}</div></main>}
