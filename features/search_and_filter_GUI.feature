Feature: Busca e Filtro
Como um usuário 
Eu quero filtrar o catálogo por gêneros 
Para explorar só o determinado tipo de filme que desejo assistir

Feature: Busca e Filtro
Como um usuário 
Eu quero pesquisar por uma palavra-chave
Para achar o filme específico que desejo assistir.

Scenario: Busca por título bem-sucedida
Given o usuário está na página de pesquisa
When o usuário digita "Oppenheimer" no campo de busca
And clica no botão de pesquisar
Then é exibido a capa e o título do filme "Oppenheimer" como opção

Scenario: Busca por termo parcial
Given o usuário está na página de pesquisa
When o usuário digita "The" no campo de busca
And clica no botão de pesquisar
Then é exibido a capa e o título dos filmes "The Time Travelers" e "The Skeleton Dance" como opções

Scenario: Busca sem resultado encontrado
Given o usuário está na página de pesquisa
When o usuário digita "aeurhdo" no campo de busca
And clica no botão de pesquisar
Then é exibido a mensagem "Opss... Nenhum resultado encontrado"

Scenario: Filtrar filmes por um único gênero
Given o usuário está na página com as opções de gênero
When o usuário seleciona o filtro "Ficção Científica"
Then é exibido a capa e o título dos filmes "The Time Travelers" e "Battle In Outer Space" como opções

Scenario: Busca e Filtro juntos
Given que o usuário pesquisou "The"
When seleciona o filtro "Comédia"
Then é exibido o filme "The Skeleton Dance" como opção

Scenario: Limpar filtros aplicados
Given que o usuário está com o filtro "Drama" ativado
When o usuário seleciona a opção "retirar filtros"
Then é exibido todos os filmes disponíveis da plataforma
