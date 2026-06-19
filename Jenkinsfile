pipeline {

    agent any

    environment {
        CI = 'true'
    }

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

            failFast false

            parallel {

                stage('Login') {
                    steps {
                        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                            bat '''
                            npx cucumber-js tests/features/login.feature ^
                            --import "tests/steps/**/*.mjs" ^
                            --import "support/**/*.mjs" ^
                            -f progress ^
                            -f allure-cucumberjs/reporter
                            '''
                        }
                    }
                }

                stage('Products') {
                    steps {
                        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                            bat '''
                            npx cucumber-js tests/features/products.feature ^
                            --import "tests/steps/**/*.mjs" ^
                            --import "support/**/*.mjs" ^
                            -f progress ^
                            -f allure-cucumberjs/reporter
                            '''
                        }
                    }
                }

                stage('Cart') {
                    steps {
                        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                            bat '''
                            npx cucumber-js tests/features/cart.feature ^
                            --import "tests/steps/**/*.mjs" ^
                            --import "support/**/*.mjs" ^
                            -f progress ^
                            -f allure-cucumberjs/reporter
                            '''
                        }
                    }
                }

                stage('Checkout') {
                    steps {
                        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                            bat '''
                            npx cucumber-js tests/features/checkout.feature ^
                            --import "tests/steps/**/*.mjs" ^
                            --import "support/**/*.mjs" ^
                            -f progress ^
                            -f allure-cucumberjs/reporter
                            '''
                        }
                    }
                }

                stage('Admin Access') {
                    steps {
                        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                            bat '''
                            npx cucumber-js tests/features/admin-access.feature ^
                            --import "tests/steps/**/*.mjs" ^
                            --import "support/**/*.mjs" ^
                            -f progress ^
                            -f allure-cucumberjs/reporter
                            '''
                        }
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
            script {
                def allureStatus = bat(
                    returnStatus: true,
                    script: '''
                    if not exist allure-results mkdir allure-results
                    dir /s /b allure-results/*-result.json >nul 2>nul
                    if errorlevel 1 (
                        echo Nenhum arquivo *-result.json encontrado em allure-results
                        exit /b 0
                    )
                    if exist allure-report rmdir /s /q allure-report
                    npx allure generate allure-results -o allure-report --clean
                    '''
                )

                if (allureStatus != 0) {
                    echo 'Aviso: falha ao gerar Allure report, mas o pipeline nao sera interrompido no post always.'
                }
            }
            archiveArtifacts artifacts: 'allure-results/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
        }
    }
}
