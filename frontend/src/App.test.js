import {render,screen} from '@testing-library/react';
import App from './App';

test('exibe o acesso à demonstração e seus campos',()=>{
 render(<App/>);
 expect(screen.getByRole('heading',{name:'Bem-vindo de volta'})).toBeInTheDocument();
 expect(screen.getByLabelText('E-mail')).toBeRequired();
 expect(screen.getByRole('button',{name:'Entrar'})).toBeInTheDocument();
});
