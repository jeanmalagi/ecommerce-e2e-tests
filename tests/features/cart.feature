Feature: Carrinho

  Scenario: Cliente adiciona um produto ao carrinho
    Given que o cliente está logado
    When ele adiciona um produto ao carrinho
    Then deve ver o produto no carrinho
  
  Scenario: Cliente remove um produto do carrinho
    Given que o cliente está com produto no carrinho
    When ele remove o produto do carrinho
    Then o carrinho deve ficar vazio

  Scenario: Cliente adiciona múltiplos produtos ao carrinho
    Given que o cliente está logado
    When ele adiciona múltiplos produtos ao carrinho
    Then deve ver mais de um produto no carrinho

  Scenario: Cliente visualiza carrinho vazio
    Given que o cliente está logado
    When ele acessa o carrinho
    Then deve ver mensagem de carrinho vazio