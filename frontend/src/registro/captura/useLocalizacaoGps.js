import { useCallback, useEffect, useRef, useState } from 'react';
import { lerPosicaoAtual } from './geo';

export function useLocalizacaoGps() {
  const [estado, setEstado] = useState('parado');
  const [posicao, setPosicao] = useState(null);
  const [erro, setErro] = useState(null);
  const montado = useRef(true);

  useEffect(() => {
    montado.current = true;
    return () => {
      montado.current = false;
    };
  }, []);

  const buscar = useCallback(async () => {
    setEstado('buscando');
    setErro(null);
    try {
      const lida = await lerPosicaoAtual();
      if (!montado.current) return;
      setPosicao(lida);
      setEstado('ok');
    } catch (e) {
      if (!montado.current) return;
      setErro(e.message);
      setEstado('erro');
    }
  }, []);

  return { estado, posicao, erro, buscar };
}
