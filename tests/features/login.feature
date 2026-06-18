Feature: Login

  Scenario: Login com sucesso
    Given que o usuário acessa a página de login
    When ele preenche "admin@email.com" e "123456"
    And clica no botão de login
    Then ele deve ser redirecionado para a área administrativa

  Scenario: Senha inválida
    Given que o usuário acessa a página de login
    When ele preenche "admin@email.com" e "errada"
    And clica no botão de login
    Then deve ver uma mensagem de erro de autenticação

  Scenario: Usuário inexistente
    Given que o usuário acessa a página de login
    When ele preenche "naoexiste@email.com" e "123456"
    And clica no botão de login
    Then deve ver uma mensagem de usuário não encontrado