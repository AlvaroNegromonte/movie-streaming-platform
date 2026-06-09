Feature: Busca e Filtro de Filmes
  Como um cliente 
  Eu quero consultar o catálogo passando parâmetros de título e/ou gênero
  Para que o sistema retorne a lista de filmes correspondente

  Scenario: Busca por título bem-sucedida
    Given o filme "Oppenheimer" está armazenado no sistema
    When eu peço ao sistema para buscar pelo título "Oppenheimer"
    Then o sistema retorna os dados do filme "Oppenheimer"
    And o filme "Oppenheimer" continua armazenado no sistema

  Scenario: Busca por termo parcial
    Given os filmes "The Time Travelers" e "The Skeleton Dance" estão armazenados no sistema
    When eu peço ao sistema para buscar pelo título "The"
    Then o sistema retorna os filmes "The Time Travelers" e "The Skeleton Dance"
    And os filmes "The Time Travelers" e "The Skeleton Dance" continuam armazenados no sistema

  Scenario: Busca sem resultado encontrado
    Given o sistema possui vários filmes armazenados, mas nenhum com o título "aeurhdo"
    When eu peço ao sistema para buscar pelo título "aeurhdo"
    Then o sistema retorna uma lista vazia

  Scenario: Filtrar filmes por um único gênero
    Given o filme "Oppenheimer" classificado como "Drama" está armazenado no sistema
    When eu peço ao sistema para listar os filmes do gênero "Drama"
    Then o sistema retorna apenas o filme "Oppenheimer"

  Scenario: Busca e Filtro juntos
    Given o filme "The Time Travelers" classificado como "Ficção Científica" e "The Skeleton Dance" classificado como "Comédia" estão no sistema
    When eu peço ao sistema para buscar pelo título "The" e filtrar pelo gênero "Comédia"
    Then o sistema retorna apenas o filme "The Skeleton Dance"

  Scenario: Listar todos os filmes (Equivalente a limpar filtros)
    Given o sistema possui os seguintes filmes armazenados:
      | titulo                | genero            |
      | Oppenheimer           | Drama             |
      | Steamboat Willie      | Comédia           |
      | The Skeleton Dance    | Comédia           |
      | Battle In Outer Space | Ficção Científica |
      | The Time Travelers    | Ficção Científica |
      | Popeye for President  | Animação          |
    When eu peço ao sistema para listar todos os filmes sem filtros
    Then o sistema retorna uma lista contendo 6 filmes