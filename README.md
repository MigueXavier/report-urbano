# Report Urbano — Parte 4: Mapa (RF13 e RF14)

Componente React mobile-first usando Leaflet e React Leaflet, com cores inspiradas na logo do Report Urbano.

## 1. Instalar dependências

Na pasta do seu frontend React:

```bash
npm install leaflet react-leaflet
```

O componente está preparado para Create React App (comando `npm start`), comum em projetos React. Se o projeto usar Vite, troque `process.env.REACT_APP_API_URL` por `import.meta.env.VITE_API_URL`.

## 2. Copiar os arquivos

Copie:
- `src/components/MapaOcorrencias/MapaOcorrencias.jsx`
- `src/components/MapaOcorrencias/MapaOcorrencias.css`
- `public/logo-report-urbano.png`

para os mesmos caminhos no seu frontend.

Depois, em uma tela/rota do React:

```jsx
import MapaOcorrencias from "./components/MapaOcorrencias/MapaOcorrencias";

export default function App() {
  return <MapaOcorrencias />;
}
```

## 3. Configurar o endereço do backend

Crie/edite `.env` na raiz do frontend:

```env
REACT_APP_API_URL=http://localhost:8080
```

Reinicie o servidor React depois de alterar `.env`. Em Create React App, as variáveis precisam começar com `REACT_APP_`.

## 4. Contrato esperado do endpoint

O componente chama:

`GET /ocorrencias?bbox=minLng,minLat,maxLng,maxLat&acessibilidade=true`

O parâmetro `acessibilidade=true` só é enviado quando o toggle está ligado. O mapa consulta novamente quando a pessoa move ou altera o zoom, com um pequeno atraso para evitar várias chamadas seguidas.

O componente aceita uma lista JSON, `{ "content": [...] }`, `{ "ocorrencias": [...] }` ou uma coleção GeoJSON `FeatureCollection`.

Cada ocorrência deve ter uma localização GeoJSON, por exemplo:

```json
{
  "id": "exemplo-1",
  "tipo": "CALCADA_QUEBRADA",
  "gravidade": "ALTA",
  "status": "ABERTA",
  "descricao": "Piso irregular na passagem",
  "localizacao": {
    "type": "Point",
    "coordinates": [-43.9386, -19.9191]
  }
}
```

<<<<<<< Updated upstream
---

## 📄 Requisitos

A especificação completa está na documentação do projeto. Itens marcados com *(proposta)* ainda aguardam aprovação do grupo.

### Funcionais

| Grupo | IDs | Descrição |
| :--- | :--- | :--- |
| Conta e perfil | RF01–RF03 | Cadastro, login (com informação opcional de deficiência/mobilidade reduzida) e histórico do usuário |
| Registro de ocorrência | RF04–RF12 | Foto, GPS, ajuste da localização *(proposta)*, tipo, impacto em acessibilidade, perfis afetados, gravidade, descrição opcional e registro automático de autor/data/hora |
| Visualização | RF13–RF16 | Mapa, filtro de acessibilidade, filtros por tipo/status/período *(proposta)* e detalhe da ocorrência |
| Confirmação e agregação | RF17–RF21 | Confirmação com um toque, bloqueio de confirmação repetida, detecção de duplicatas (20 m), clusterização (100 m) e score de prioridade |
| Ciclo de vida | RF22–RF24 | Marcar como resolvida (com mais de uma marcação independente *(proposta)*) e manter status e data |
| Painel de medição | RF25–RF28 | Painel público por região: abertas, tempo médio sem resposta, resolvidas em 30 dias; comparação entre regiões *(proposta)* |
| Índice de Acesso | RF29–RF31 | Base de destinos essenciais, verificação de barreira em 150 m e cálculo do índice |
| Encaminhamento | RF32 | Dossiê em PDF por região |
| Moderação | RF33–RF34 | Denúncia de conteúdo indevido e remoção por moderador |

### Não funcionais (destaques)

- **Tecnologia (RNF01–RNF08):** MongoDB, GeoJSON com `2dsphere`, PWA para celular, Java/Spring Boot + React, deploy na Vercel, código em Git.
- **Desempenho (RNF09–RNF11):** registro em menos de 30 s; mapa carrega a área visível em até 3 s em conexão móvel; Índice de Acesso calculado em processo separado *(proposta)*.
- **Usabilidade e acessibilidade (RNF12–RNF16):** sem texto obrigatório no registro, WCAG 2.1 AA *(proposta)*, compatibilidade com leitor de tela, alvos de toque adequados (mín. 44 × 44 pt) e interface responsiva.
- **Disponibilidade (RNF17–RNF18):** 24/7; exige conexão estável e exibe mensagem de erro com próxima ação sugerida quando offline.
- **Segurança e privacidade (RNF19–RNF22):** senhas com hash, consentimento explícito para câmera e localização, orientação para não fotografar pessoas/placas/fachadas identificáveis e autoria anônima por padrão.
- **Evolução (RNF23):** modelagem de dados que permite incluir novas cidades sem mudar a estrutura.

---

## 🗺️ Roadmap (Sprints)

| Sprint | Foco | Requisitos |
| :--- | :--- | :--- |
| **1** | Registro e visualização | RF01–RF03, RF04–RF12, RF13, RF14, RF16 |
| **2** | Confirmação e ciclo de vida | RF17, RF18, RF19, RF20, RF21, RF22–RF24 |
| **3** | Medição | RF25–RF27, RF29–RF31 |
| **Se houver tempo** | Backlog opcional | RF15, RF28, RF32, RF33, RF34 |

> **Decisão pendente:** o nível de conformidade de acessibilidade (RNF13) ainda precisa ser definido pela equipe antes da Sprint 1.

---

## 👥 Integrantes

| Integrante 
| :--- | :--- | :--- |
| **Bernardo Machado**  |
| **Guilherme Tolentino**  |
| **Matheus Teixeira**  |
| **Mario Eduardo**  |
| **MIguel Xavier**  |
| **Rafael Abi-Saber**  |

*(Preencher conforme a seção 5.1 da documentação.)*

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Java 17+ / Maven
- Node.js 18+
- Instância do MongoDB

### Passo a passo
1. Clone o repositório:
   ```bash
   git clone https://github.com/usuario/report-urbano.git
   cd report-urbano
   ```
2. Executando o Back-end (configure antes a conexão com o MongoDB):
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
3. Executando o Front-end:
   ```bash
   cd frontend
   npm install
   npm start
   ```

---

## 🔄 Metodologia

Abordagem ágil, com sprints curtas e quadro Kanban (Backlog → A fazer → Em andamento → Em revisão → Concluído); cada cartão referencia o ID do requisito (ex.: RF17). A fase de entendimento seguiu Design Thinking (Matriz de Alinhamento, Mapa de Stakeholders, personas e Proposta de Valor) antes dos requisitos e da prototipação.

| Recurso | Link |
| :--- | :--- |
| Quadro Kanban | [inserir link do quadro] |
| Repositório Git | [inserir link do repositório] |
| Protótipo navegável | [Balsamiq](https://balsamiq.cloud/smo0am2/p179m1k) |

---

## 📚 Referências

- ABNT NBR 9050 – Acessibilidade a edificações, mobiliário, espaços e equipamentos urbanos.
- Lei nº 13.146/2015 – Lei Brasileira de Inclusão da Pessoa com Deficiência.
- [ODS 11 – ONU Brasil](https://brasil.un.org/pt-br/sdgs/11)
- [WCAG 2.1 – W3C](https://www.w3.org/TR/WCAG21/)
- [MongoDB – 2dsphere Indexes](https://www.mongodb.com/docs/manual/core/2dsphere/)

---

## 📝 Licença
Este projeto está sob a licença MIT.
=======
**Importante:** GeoJSON usa `[longitude, latitude]`. O backend do grupo precisa aceitar o formato do `bbox` acima e aplicar o filtro geográfico (`$geoWithin`/índice `2dsphere`, conforme a divisão da sprint). Se o contrato que o backend implementar for diferente, ajuste a montagem de `params` no componente.

## 5. Observações

- O mapa começa centralizado em Belo Horizonte.
- Os marcadores abrem um popup com tipo, gravidade, status e descrição quando disponíveis.
- O frontend não inventa ocorrências: se o backend não estiver conectado, aparecerá uma mensagem de configuração/conexão.
- O botão de recentralizar é visual nesta versão inicial; se quiser ativá-lo, posso ligar o botão ao controle do mapa na próxima integração.
- Os tiles do mapa são servidos pelo OpenStreetMap e precisam de internet.
>>>>>>> Stashed changes