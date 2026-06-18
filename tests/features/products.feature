Feature: Produtos

  Scenario: Admin cria um novo produto
    Given que o administrador está logado
    When ele acessa a página de produtos
    And ele cria um novo produto
    Then o produto deve ser criado com sucesso

  Scenario: Admin edita um produto existente
    Given que o administrador está logado
    When ele acessa a página de produtos
    And ele edita um produto
    Then as alterações devem ser salvas com sucesso 

  Scenario: Admin visualiza lista de produtos após login
    Given que o administrador está logado
    When ele acessa a página de produtos
    Then deve ver uma lista de produtos

  Scenario: Admin visualiza detalhes de um produto
    Given que o administrador está logado
    When ele acessa a página de produtos
    And clica em um produto
    Then deve ver os detalhes do produto  

  Scenario: Cliente faz login e acessa lista de produtos
    Given que o cliente acessa a página de login
    When ele preenche "cliente@email.com" e "123456"
    And clica no botão de login
    Then ele deve ver a lista de produtos

  Scenario: Excluir produto editado com sucesso
    Given que o administrador está logado
    When ele acessa a página de produtos
    And ele exclui o produto editado
    Then o produto deve ser excluído com sucesso
  