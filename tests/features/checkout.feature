Feature: Checkout

    Scenario: Cliente realiza uma compra com sucesso

        Given que o usuário cliente está logado

        When ele adiciona um ou mais produtos ao carrinho
        And acessa o carrinho
        And confirma os produtos do carrinho
        And finaliza a compra
        And confirma a compra

        Then o pedido deve ser criado com sucesso