import {useState} from 'react';import {useNavigate} from 'react-router-dom';import {Bar,Row} from '../components/ui';import {REGIOES} from '../data/mock';
export function Painel(){const n=useNavigate();const [r,setR]=useState('Centro_Sul'),[a,t,d]=REGIOES[r];
 return <main className="scr"><Bar title="Painel público" right={<button className="ico" aria-label="Perfil" onClick={()=>n('/perfil')}>👤</button>}/><label>Região<select value={r} onChange={e=>setR(e.target.value)}>{Object.keys(REGIOES).map(k=><option key={k} value={k}>{k.replace('_','-')}</option>)}</select></label>
 <div className="tbl"><Row k="Ocorrências abertas" v={a}/><Row k="Tempo médio sem resposta" v={t+' dias'}/><Row k="Resolvidas nos últimos 30 dias" v={d}/></div>
 <small>Dados de demonstração. O painel apenas mede e exibe, sem metas para a prefeitura.</small></main>}
export function Erro(){const n=useNavigate();
 return <main className="scr err" role="alert"><h1>⚠ Não foi possível acessar esse serviço</h1><p>Confira sua conexão com a internet e tente novamente. O app não funciona sem conexão.</p><button className="btn" onClick={()=>n(-1)}>Tentar novamente</button></main>}
