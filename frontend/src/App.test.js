import { render, screen } from '@testing-library/react';
import App from './App';

test('mostra a tela de login do Report Urbano', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
});
