import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import OcorrenciaDetalhe from "./pages/OcorrenciaDetalhe";
import MeuHistorico from "./pages/MeuHistorico";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/historico" />} />
        <Route path="/historico" element={<MeuHistorico />} />
        <Route path="/ocorrencias/:id" element={<OcorrenciaDetalhe />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
