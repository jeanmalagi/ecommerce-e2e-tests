Feature: Acesso Administrativo

  Scenario: Cliente não-admin não deve acessar a área administrativa
    Given que o cliente está logado
    When ele tenta acessar a área administrativa
    Then deve ser redirecionado para a lista de produtos
