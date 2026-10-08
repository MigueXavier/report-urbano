import {useState} from 'react';import {Link,useNavigate} from 'react-router-dom';import {useApp} from '../context/AppContext';import {F} from '../components/ui';
const Logo=()=><img src={process.env.PUBLIC_URL+"/logo.png"} alt="Report Urbano — Belo Horizonte mais acessível" className="logo"/>;
export function Login(){const {setUser}=useApp(),n=useNavigate(),[e,setE]=useState('');
 return <main className="scr"><Logo/><form className="col" onSubmit={x=>{x.preventDefault();setUser({nome:'Miguel',email:e});n('/fluxo')}}>
 <F l="E-mail" type="email" autoComplete="email" required value={e} onChange={x=>setE(x.target.value)}/>
 <F l="Senha" type="password" autoComplete="current-password" required/>
 <button className="btn">Entrar</button></form><Link className="btn sec ln" to="/cadastro">Criar conta</Link></main>}
export function Cadastro(){const n=useNavigate();
 return <main className="scr"><Logo/><form className="col" onSubmit={x=>{x.preventDefault();n('/')}}>
 <F l="E-mail" type="email" required/><F l="CPF" inputMode="numeric" required/><F l="Senha" type="password" minLength={8} required/><F l="Confirmar senha" type="password" required/>
 <label className="chk"><input type="checkbox"/> Tenho deficiência ou mobilidade reduzida (opcional)</label>
 <button className="btn">Cadastrar</button></form></main>}
export function Fluxo(){const {user,setUser}=useApp(),n=useNavigate();const go=role=>{setUser({...user,role});n('/mapa')};
 return <main className="scr"><Logo/><h2>Como deseja usar o app?</h2><button className="btn" onClick={()=>go('padrao')}>Uso padrão</button><button className="btn sec" onClick={()=>go('moderador')}>Moderação</button></main>}
