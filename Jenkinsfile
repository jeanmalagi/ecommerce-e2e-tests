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
                            if exist allure-results/login rmdir /s /q allure-results/login
                            set ALLURE_RESULTS_DIR=allure-results/login
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
                            if exist allure-results/products rmdir /s /q allure-results/products
                            set ALLURE_RESULTS_DIR=allure-results/products
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
                            if exist allure-results/cart rmdir /s /q allure-results/cart
                            set ALLURE_RESULTS_DIR=allure-results/cart
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
                            if exist allure-results/checkout rmdir /s /q allure-results/checkout
                            set ALLURE_RESULTS_DIR=allure-results/checkout
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
                            if exist allure-results/admin-access rmdir /s /q allure-results/admin-access
                            set ALLURE_RESULTS_DIR=allure-results/admin-access
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
                    if exist allure-report rmdir /s /q allure-report
                    mkdir allure-report

                    for %%D in (login products cart checkout admin-access) do (
                        dir /b allure-results/%%D/*-result.json >nul 2>nul
                        if not errorlevel 1 (
                            echo Gerando Allure report para %%D...
                            npx allure generate allure-results/%%D -o allure-report/%%D --clean
                        ) else (
                            echo Nenhum resultado Allure encontrado para %%D
                        )
                    )

                    exit /b 0
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
