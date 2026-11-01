import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';
import {AppProvider,useApp} from './context/AppContext';
import {Login,Cadastro,Fluxo} from './pages/Auth';
import Home from './pages/Home';
import NovaDenuncia from './pages/NovaDenuncia';
import Ocorrencia from './pages/Ocorrencia';
import {Perfil,Editar,Historico} from './pages/Perfil';
import {Atividade,Fila} from './pages/Moderacao';
import {Painel,Erro} from './pages/Painel';

// Rotas que exigem login
const Priv=({children})=>useApp().user?children:<Navigate to="/" replace/>;
const P=el=><Priv>{el}</Priv>;

export default function App(){
 return <AppProvider><BrowserRouter><Routes>
  <Route path="/" element={<Login/>}/><Route path="/cadastro" element={<Cadastro/>}/>
  <Route path="/fluxo" element={P(<Fluxo/>)}/><Route path="/mapa" element={P(<Home/>)}/>
  <Route path="/nova" element={P(<NovaDenuncia/>)}/><Route path="/ocorrencia/:id" element={P(<Ocorrencia/>)}/>
  <Route path="/perfil" element={P(<Perfil/>)}/><Route path="/perfil/editar" element={P(<Editar/>)}/>
  <Route path="/historico" element={P(<Historico/>)}/><Route path="/atividade" element={P(<Atividade/>)}/>
  <Route path="/fila" element={P(<Fila/>)}/><Route path="/painel" element={P(<Painel/>)}/>
  <Route path="/erro" element={<Erro/>}/><Route path="*" element={<Navigate to="/"/>}/>
 </Routes></BrowserRouter></AppProvider>}
