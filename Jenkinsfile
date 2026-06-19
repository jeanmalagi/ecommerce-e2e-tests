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
                        set ALLURE_RESULTS_DIR=allure-results/login
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
                        set ALLURE_RESULTS_DIR=allure-results/products
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
                        set ALLURE_RESULTS_DIR=allure-results/cart
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
                        set ALLURE_RESULTS_DIR=allure-results/checkout
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
                        set ALLURE_RESULTS_DIR=allure-results/admin-access
                        npx cucumber-js tests/features/admin-access.feature ^
                        --import "tests/steps/**/*.mjs" ^
                        --import "tests/support/**/*.mjs" ^
                        -f allure-cucumberjs/reporter
                        '''
                    }
                }
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
            dir('allure-results') {
                bat 'if exist report/ rmdir /s /q report'
                bat 'npx allure generate . -o report --clean'
            }
            archiveArtifacts artifacts: 'allure-results/report/**', allowEmptyArchive: true
        }
    }
}
