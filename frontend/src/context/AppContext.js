import {createContext,useContext,useState} from 'react';
import {SEED} from '../data/mock';
const Ctx=createContext();
export const useApp=()=>useContext(Ctx);
// Estado global do app (dados fictícios). Trocar por chamadas à API Spring Boot quando o back-end estiver pronto.
export function AppProvider({children}){
 const [user,setUser]=useState(null),[list,setList]=useState(SEED);
 const [fila,setFila]=useState([3]),[derr,setDerr]=useState([]); // fila: ids denunciados; derr: derrubados pelo moderador
 const upd=(id,f)=>setList(l=>l.map(o=>o.id===id?{...o,...f(o)}:o));
 const add=o=>setList(l=>[{...o,id:Date.now()},...l]);
 const del=id=>setList(l=>l.filter(o=>o.id!==id));
 const denunciar=id=>setFila(f=>f.includes(id)?f:[...f,id]);
 const derrubar=id=>{const o=list.find(x=>x.id===id);setDerr(d=>[...d,o]);setFila(f=>f.filter(x=>x!==id));del(id)};
 return <Ctx.Provider value={{user,setUser,list,upd,add,del,fila,derr,denunciar,derrubar}}>{children}</Ctx.Provider>}
