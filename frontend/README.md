# Report Urbano — frontend

Aprimoramento do frontend inicial do grupo. Mantém React, Create React App, React Router, Leaflet, a marca e as rotas originais. Não modifica o backend nem acrescenta dependências.

## Executar

Na pasta frontend:

```bash
npm install
npm start
```

Abra o endereço exibido pelo terminal. Para compilar: `npm run build`.

## Aplicar na sua branch

1. Faça uma cópia de segurança da sua pasta frontend.
2. Na branch Guilherme, crie sua branch com `git switch -c Bernardo` (se já existir, use `git switch Bernardo`).
3. Copie o conteúdo desta pasta por cima da pasta frontend do repositório, substituindo os arquivos. Não crie frontend/frontend.
4. Execute os comandos acima e confira as telas.
5. Na raiz do repositório:

```bash
git status
git add frontend
git commit -m "Aprimora interface e responsividade do frontend"
git push -u origin Bernardo
```

Confira o `git status` antes de adicionar: ele deve mostrar somente as mudanças que você deseja enviar.

## O que mudou

- Login e cadastro com apresentação do projeto, orientações e validação de confirmação de senha.
- Seleção de perfil com cartões explicativos.
- Layout adaptado para computador e celular, mantendo azul e verde-azulado.
- Mapa com lista de ocorrências, busca por tipo/endereço e filtros por status/acessibilidade.
- Cartões com endereço, status e fotografia quando disponível.
- Formulários, botões, estados vazios e indicador de etapas padronizados.
- Edição de nome/e-mail funcionando no estado da sessão.
- Mapa acompanha localização recebida e permite ajustar o ponto por clique ou arraste.
- Aviso quando o provedor externo de mapa não carrega.

## Limites da demonstração herdada

O login aceita qualquer e-mail e senha preenchidos. O cadastro valida o formulário, mas não cria contas reais. Não use CPF ou senhas reais. O perfil de moderação é selecionável para apresentação acadêmica, sem autorização real.

Ocorrências, perfil, fotos e moderação ficam somente em memória e se perdem ao recarregar. Os números da tela inicial refletem a lista de demonstração; o painel regional usa valores fictícios do arquivo mock.js.

Confirmações independentes por usuário, autenticação, persistência, autorização de moderadores e integração com a API ainda precisam ser implementadas pelo grupo. A lógica de resolução herdada não verifica identidade independente; não é validação de produção.

O mapa depende da conexão com OpenStreetMap. A geolocalização depende de permissão do navegador. A lista permite abrir ocorrências mesmo quando o mapa falha.
