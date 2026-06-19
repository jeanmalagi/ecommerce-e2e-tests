pipeline {

    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install'
            }
        }

        stage('Features') {

            parallel {

                stage('Login') {
                    steps {
                        bat '''
                        npx cucumber-js tests/features/login.feature ^
                        --import "tests/steps/**/*.mjs" ^
                        --import "tests/support/**/*.mjs" ^
                        -f allure-cucumberjs/reporter
                        '''
                    }
                }

                stage('Products') {
                    steps {
                        bat '''
                        npx cucumber-js tests/features/products.feature ^
                        --import "tests/steps/**/*.mjs" ^
                        --import "tests/support/**/*.mjs" ^
                        -f allure-cucumberjs/reporter
                        '''
                    }
                }

                stage('Cart') {
                    steps {
                        bat '''
                        npx cucumber-js tests/features/cart.feature ^
                        --import "tests/steps/**/*.mjs" ^
                        --import "tests/support/**/*.mjs" ^
                        -f allure-cucumberjs/reporter
                        '''
                    }
                }

                stage('Checkout') {
                    steps {
                        bat '''
                        npx cucumber-js tests/features/checkout.feature ^
                        --import "tests/steps/**/*.mjs" ^
                        --import "tests/support/**/*.mjs" ^
                        -f allure-cucumberjs/reporter
                        '''
                    }
                }

                stage('Admin Access') {
                    steps {
                        bat '''
                        npx cucumber-js tests/features/admin-access.feature ^
                        --import "tests/steps/**/*.mjs" ^
                        --import "tests/support/**/*.mjs" ^
                        -f allure-cucumberjs/reporter
                        '''
                    }
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                bat 'if exist allure-report rmdir /s /q allure-report'
                bat 'npx allure generate allure-results -o allure-report --clean'
            }
        }
    }

    post {

        success {
            echo '✅ Todos os testes passaram.'
        }

        failure {
            echo '❌ Existem testes falhando.'
        }

        always {
            archiveArtifacts artifacts: 'allure-results/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
        }
    }
}
