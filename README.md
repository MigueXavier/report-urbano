# Report Urbano com Camada de Acessibilidade 🏙️♿

> Aplicação web colaborativa para registro de problemas urbanos em Belo Horizonte com foco em acessibilidade (ODS 11).

---

## 📌 Sobre o Projeto

O **Report Urbano** é uma aplicação voltada para celulares (PWA) em que moradores de Belo Horizonte registram problemas de infraestrutura urbana (buracos, calçadas danificadas, ausência de rampas) com foto e localização. O diferencial é tratar a **acessibilidade como parte do mesmo registro**: no mesmo fluxo, a pessoa informa se a ocorrência impede ou dificulta a passagem de quem tem deficiência ou mobilidade reduzida e quais perfis são afetados.

As ocorrências aparecem em um mapa público, podem ser confirmadas por outros moradores com um toque e são agrupadas por proximidade para indicar onde o problema é mais grave. Com esses dados, o sistema gera um painel de medição por região, calcula um **Índice de Acesso** para destinos essenciais e produz um **dossiê em PDF** para encaminhamento aos órgãos competentes.

- **Contexto:** Belo Horizonte / ODS 11 – Cidades e Comunidades Sustentáveis.
- **Instituição:** Pontifícia Universidade Católica de Minas Gerais (PUC Minas).
- **Protótipo Navegável:** [Acessar no Balsamiq](https://balsamiq.cloud/smo0am2/p179m1k) (abrir em *Full Screen Presentation* e escolher *User Test*; não é preciso login).

---

## ❓ O Problema

- Ninguém tem um mapa das barreiras das calçadas: a prefeitura registra buraco na via, mas não registra degrau nem falta de rampa — justamente o que impede uma pessoa com deficiência de chegar ao destino.
- Os canais de denúncia existentes são pouco usados (na análise da equipe, o Colab teve menos de uma publicação por usuário cadastrado em dez anos).
- Quem registra raramente recebe retorno e, por isso, tende a não registrar de novo. Sem retorno visível, também não há como provar que o problema existe nem há quanto tempo está sem resposta.

## 🎯 Objetivos

- Registrar uma ocorrência com foto e localização em **menos de 30 segundos**, sem digitação obrigatória.
- Classificar cada ocorrência por tipo, gravidade e impacto em acessibilidade, indicando os perfis afetados.
- Dar retorno imediato por **confirmação coletiva com um toque** e por sugestão de ocorrências semelhantes (evitando duplicidade).
- Agrupar ocorrências próximas e calcular um **score de prioridade** por grupo.
- Exibir um **painel público por região** (ocorrências abertas, tempo médio sem resposta, resolvidas nos últimos 30 dias).
- Calcular o **Índice de Acesso** dos destinos essenciais (pontos de ônibus, UBS, escolas, farmácias e praças).
- Gerar um **dossiê em PDF** por região, com fotos, endereços e prioridade.
- Estruturar o sistema para que novas cidades possam ser incluídas depois de Belo Horizonte.

## 👤 Público-alvo e Personas

O público principal são pessoas com deficiência física ou visual que circulam por BH e moradores que já reportam buracos e calçadas quebradas. Em segundo plano, trabalhadores que dependem das ruas (como entregadores) e familiares ou cuidadores de pessoas com deficiência.

| Persona | Perfil | O que precisa da aplicação |
| :--- | :--- | :--- |
| **Marilene, 65** | Aposentada, caminha bastante, letramento digital básico | Denunciar de forma simples, ser levada a sério e saber a posição dos órgãos responsáveis |
| **Galeano, 24** | Motoboy, letramento digital excelente | Registro rápido, sem interromper o trabalho, e acompanhamento da evolução dos casos |
| **Joana, 45** | Empresária, mãe de um menino cadeirante | Denunciar falta de acessibilidade com fotos/vídeos e acompanhar se o local foi fiscalizado ou adequado |

---

## ✨ Funcionalidades

- **Registro de ocorrência** com foto obrigatória, GPS (ajustável no mapa), tipo, gravidade, impacto em acessibilidade e perfis afetados (cadeirante, mobilidade reduzida, baixa visão, idoso). Descrição em texto é opcional.
- **Mapa público** com filtro por ocorrências que impactam a acessibilidade e tela de detalhe (foto, tipo, data, status, confirmações e dias em aberto).
- **Confirmação com um toque**, sem repetição pelo mesmo usuário.
- **Checagem de duplicatas:** ao registrar, o sistema sugere ocorrências do mesmo tipo em um raio de 20 m.
- **Clusterização** de ocorrências em um raio de 100 m, com score de prioridade (densidade, confirmações, tempo em aberto, gravidade e proximidade de destino essencial).
- **Ciclo de vida:** qualquer usuário pode marcar uma ocorrência como resolvida; o status e a data da mudança são mantidos.
- **Painel de medição público** por região (não exige login).
- **Índice de Acesso:** proporção de destinos essenciais com barreira de acessibilidade em um raio de 150 m.
- **Dossiê em PDF** por região para encaminhamento aos órgãos competentes.
- **Moderação:** qualquer usuário pode denunciar conteúdo indevido; a remoção é restrita a moderadores.
- **Privacidade:** a identidade do autor só é divulgada se o usuário desejar.

### 🚫 Fora do escopo

- Cálculo de rotas acessíveis (não existe grafo de calçadas no OpenStreetMap brasileiro).
- Integração com a Central 156 ou outro canal oficial da prefeitura.
- Gamificação (pontos, ranking, missões).
- Metas de resolução para a prefeitura — o painel apenas mede e exibe.

---

## 🛠️ Tecnologias Utilizadas

- **Front-end:** React (PWA)
- **Back-end:** Java com Spring Boot
- **Banco de Dados:** MongoDB (índice `2dsphere` e coordenadas GeoJSON; consultas de proximidade com operadores geoespaciais nativos)
- **Hospedagem / Deploy:** Vercel
- **Versionamento:** Git
- **Prototipação:** Balsamiq

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

| Integrante | Papel | Responsabilidades |
| :--- | :--- | :--- |
| **[Nome 1]** | [Papel] | [Responsabilidades] |
| **[Nome 2]** | [Papel] | [Responsabilidades] |
| **[Nome 3]** | [Papel] | [Responsabilidades] |
| **[Nome 4]** | [Papel] | [Responsabilidades] |
| **[Nome 5]** | [Papel] | [Responsabilidades] |

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