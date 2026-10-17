# Pokédex Clássica

## Autor
Felipe Domingos Ribeiro Pereira — Matrícula: 22604250

## Descrição
Uma Pokédex no estilo retro que busca um Pokémon pelo nome ou número, exibe sua imagem oficial, nome e tipos, e permite salvar um time de Pokémon favoritos com persistência em banco de dados real.

## API utilizada
- Nome da API: PokeAPI
- Documentação: https://pokeapi.co/docs/v2
- Endpoint(s) consumido(s): `GET https://pokeapi.co/api/v2/pokemon/{nome-ou-numero}`

## Funcionalidades
- Buscar um Pokémon digitando o nome ou o número na Pokédex (ou pressionando Enter)
- Exibir a imagem oficial, o nome (com número formatado, ex: #025) e os tipos do Pokémon encontrado
- Exibir uma mensagem de erro amigável quando o Pokémon não é encontrado ou a busca falha
- Adicionar o Pokémon exibido ao "Meu Time" (favoritos)
- Listar o time salvo e remover qualquer Pokémon dele

## Persistência de dados
- **Banco:** Supabase (PostgreSQL), acessado direto do frontend via `@supabase/supabase-js`.
- **Tabela:** `favoritos`
  | Coluna | Tipo | Descrição |
  |---|---|---|
  | `id` | gerado automaticamente | identificador do registro |
  | `criado_em` | gerado automaticamente | data/hora de criação |
  | `nome_item` | texto | nome do Pokémon favoritado |
  | `dados_extra` | texto (JSON) | sprite, tipos e número da Pokédex, usados para montar o card do time sem refazer a consulta à PokeAPI |
- **CRUD implementado:** criar (favoritar), listar (carregar o time ao abrir a página) e excluir (botão "remover" em cada item do time). Update não foi necessário para este recurso.
- **Limitação conhecida:** nesta etapa, as políticas de acesso (RLS) da tabela `favoritos` estão abertas para leitura e escrita por qualquer usuário anônimo — não há autenticação de usuário, então o time é compartilhado por quem acessar a aplicação, não individual por visitante.

## Como executar localmente
1. Clone: `git clone https://github.com/felipepribeiro697-debug/BootCampIIAplicacao.git`
2. Abra o arquivo `index.html` no navegador

## Como rodar com Docker
```
docker run -d -p 8080:80 steverogers03/bootcamp2-app:1.0
```
Depois acesse http://localhost:8080

## SQ4 — Explorando a orquestração
_(Print do `docker ps` com os dois containers rodando simultaneamente, nas portas 8080 e 8081, commitado no repositório como imagem.)_

[PREENCHER: parágrafo sobre "se eu tivesse 100 containers, como gerenciaria?" — conceitos de cluster, pod e réplica (Kubernetes)]

## Links
- **Aplicação no ar (GitHub Pages):** https://felipepribeiro697-debug.github.io/BootCampIIAplicacao/
- **Repositório:** https://github.com/felipepribeiro697-debug/BootCampIIAplicacao
- **Repositório no Docker Hub:** https://hub.docker.com/r/steverogers03/bootcamp2-app
