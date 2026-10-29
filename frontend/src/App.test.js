import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./registro/captura/MapaAjusteLocalizacao', () => () => null);

beforeEach(() => window.localStorage.clear());

test('abre o registro pedindo consentimento de câmera e localização', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Antes de registrar' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Concordo e quero continuar' })).toBeInTheDocument();
});
