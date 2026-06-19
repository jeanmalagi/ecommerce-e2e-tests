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
                        -f @shelex/cucumberjs-allure2-reporter:./allure-results/login
                        '''
                    }
                }

                stage('Products') {
                    steps {
                        bat '''
                        npx cucumber-js tests/features/products.feature ^
                        --import "tests/steps/**/*.mjs" ^
                        --import "tests/support/**/*.mjs" ^
                        -f @shelex/cucumberjs-allure2-reporter:./allure-results/products
                        '''
                    }
                }

                stage('Cart') {
                    steps {
                        bat '''
                        npx cucumber-js tests/features/cart.feature ^
                        --import "tests/steps/**/*.mjs" ^
                        --import "tests/support/**/*.mjs" ^
                        -f @shelex/cucumberjs-allure2-reporter:./allure-results/cart
                        '''
                    }
                }

                stage('Checkout') {
                    steps {
                        bat '''
                        npx cucumber-js tests/features/checkout.feature ^
                        --import "tests/steps/**/*.mjs" ^
                        --import "tests/support/**/*.mjs" ^
                        -f @shelex/cucumberjs-allure2-reporter:./allure-results/checkout
                        '''
                    }
                }

                stage('Admin Access') {
                    steps {
                        bat '''
                        npx cucumber-js tests/features/admin-access.feature ^
                        --import "tests/steps/**/*.mjs" ^
                        --import "tests/support/**/*.mjs" ^
                        -f @shelex/cucumberjs-allure2-reporter:./allure-results/admin-access
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
            archiveArtifacts artifacts: '**/*.png, **/*.log, allure-results/**', allowEmptyArchive: true
            dir('allure-results') {
                bat 'if exist report rmdir /s /q report'
                bat 'allure generate . -o report --clean'
                archiveArtifacts artifacts: 'report/**', allowEmptyArchive: true
            }
        }
    }
}