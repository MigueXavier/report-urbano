import { RascunhoOcorrenciaProvider } from './registro/RascunhoOcorrenciaContext';
import RegistroOcorrencia from './registro/RegistroOcorrencia';

function App() {
  return (
    <RascunhoOcorrenciaProvider>
      <RegistroOcorrencia />
    </RascunhoOcorrenciaProvider>
  );
}

export default App;
