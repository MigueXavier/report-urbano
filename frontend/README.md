# Report Urbano — Front-end

React (Create React App) pensado para celular, instalável como PWA. Segue o protótipo do Balsamiq e o design system do grupo.

## Como executar
```bash
npm install
npm start      # http://localhost:3000
npm test
npm run build  # gera /build (a Vercel usa este comando)
```
Para abrir no celular, use o endereço `Network` mostrado no terminal (mesmo Wi-Fi). Câmera e localização só funcionam em HTTPS (ex.: após o deploy na Vercel).

## Estrutura de `src/`
| Pasta / arquivo | Conteúdo |
| :--- | :--- |
| `App.js` | Rotas e proteção de telas que exigem login |
| `context/AppContext.js` | Estado global (usuário, ocorrências, fila de moderação) |
| `pages/` | Telas: `Auth` (login, cadastro, fluxo), `Home` (mapa), `NovaDenuncia` (5 passos), `Ocorrencia` (detalhe), `Perfil`, `Moderacao` (atividade e fila), `Painel` (painel público e erro) |
| `components/` | `ui.js` (botões, cartões, diálogo...) e `Mapa.js` (Leaflet + OpenStreetMap) |
| `data/mock.js` | Dados fictícios e constantes (tipos, perfis, regiões) |
| `index.css` | Estilos globais e tokens do design system |

## Pendências
- Login e dados são simulados: ligar ao back-end Spring Boot (substituir o estado em `AppContext.js` por chamadas à API).
- Endereço da ocorrência mostra latitude/longitude (falta geocodificação).
- Service worker (offline não é requisito, RNF18).
