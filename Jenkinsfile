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
                        --config cucumber.mjs
                        '''
                    }
                }

                stage('Products') {
                    steps {
                        bat '''
                        npx cucumber-js tests/features/products.feature ^
                        --config cucumber.mjs
                        '''
                    }
                }

                stage('Cart') {
                    steps {
                        bat '''
                        npx cucumber-js tests/features/cart.feature ^
                        --config cucumber.mjs
                        '''
                    }
                }

                stage('Checkout') {
                    steps {
                        bat '''
                        npx cucumber-js tests/features/checkout.feature ^
                        --config cucumber.mjs
                        '''
                    }
                }

                stage('Admin Access') {
                    steps {
                        bat '''
                        npx cucumber-js tests/features/admin-access.feature ^
                        --config cucumber.mjs
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
            bat '''
            if not exist allure-results mkdir allure-results
            dir /b allure-results\*-result.json >nul 2>nul
            if errorlevel 1 (
                echo Nenhum arquivo *-result.json encontrado em allure-results
            ) else (
                if exist allure-report rmdir /s /q allure-report
                npx allure generate allure-results -o allure-report --clean
            )
            '''
            archiveArtifacts artifacts: 'allure-results/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
        }
    }
}
