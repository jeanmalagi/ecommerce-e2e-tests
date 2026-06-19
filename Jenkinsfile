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
                        if exist allure-results\login rmdir /s /q allure-results\login
                        npx cucumber-js tests/features/login.feature ^
                        --import "tests/steps/**/*.mjs" ^
                        --import "tests/support/**/*.mjs" ^
                        -f cucumberjs-allure2-reporter:./allure-results/login
                        '''
                    }
                }

                stage('Products') {
                    steps {
                        bat '''
                        if exist allure-results\products rmdir /s /q allure-results\products
                        npx cucumber-js tests/features/products.feature ^
                        --import "tests/steps/**/*.mjs" ^
                        --import "tests/support/**/*.mjs" ^
                        -f cucumberjs-allure2-reporter:./allure-results/products
                        '''
                    }
                }

                stage('Cart') {
                    steps {
                        bat '''
                        if exist allure-results\cart rmdir /s /q allure-results\cart
                        npx cucumber-js tests/features/cart.feature ^
                        --import "tests/steps/**/*.mjs" ^
                        --import "tests/support/**/*.mjs" ^
                        -f cucumberjs-allure2-reporter:./allure-results/cart
                        '''
                    }
                }

                stage('Checkout') {
                    steps {
                        bat '''
                        if exist allure-results\checkout rmdir /s /q allure-results\checkout
                        npx cucumber-js tests/features/checkout.feature ^
                        --import "tests/steps/**/*.mjs" ^
                        --import "tests/support/**/*.mjs" ^
                        -f cucumberjs-allure2-reporter:./allure-results/checkout
                        '''
                    }
                }

                stage('Admin Access') {
                    steps {
                        bat '''
                        if exist allure-results\admin-access rmdir /s /q allure-results\admin-access
                        npx cucumber-js tests/features/admin-access.feature ^
                        --import "tests/steps/**/*.mjs" ^
                        --import "tests/support/**/*.mjs" ^
                        -f cucumberjs-allure2-reporter:./allure-results/admin-access
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
                bat 'if exist report rmdir /s /q report'
                bat 'npx allure generate . -o report --clean'
            }
            archiveArtifacts artifacts: 'allure-results/report/**', allowEmptyArchive: true
        }
    }
}
