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

        stage('Clean Allure Artifacts') {
            steps {
                bat '''
                if exist allure-results rmdir /s /q allure-results
                if exist allure-report rmdir /s /q allure-report
                '''
            }
        }

        stage('Features') {

            failFast false

            parallel {

                stage('Login') {
                    steps {
                        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                            script {
                                def testStatus = bat(
                                    returnStatus: true,
                                    script: '''
                                    if not exist allure-report mkdir allure-report
                                    npx cucumber-js --config cucumber.mjs --profile login
                                    '''
                                )
                                bat '''
                                dir /b allure-results/login/*-result.json >nul 2>nul
                                if errorlevel 1 (
                                    echo Nenhum resultado Allure encontrado para login
                                    exit /b 0
                                )
                                npx allure generate allure-results/login -o allure-report/login --clean --single-file
                                if not exist allure-report/login/index.html (
                                    echo index.html nao foi gerado para login
                                    exit /b 1
                                )
                                '''
                                if (testStatus != 0) {
                                    error('Login tests failed')
                                }
                            }
                        }
                    }
                }

                stage('Products') {
                    steps {
                        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                            script {
                                def testStatus = bat(
                                    returnStatus: true,
                                    script: '''
                                    if not exist allure-report mkdir allure-report
                                    npx cucumber-js --config cucumber.mjs --profile products
                                    '''
                                )
                                bat '''
                                dir /b allure-results/products/*-result.json >nul 2>nul
                                if errorlevel 1 (
                                    echo Nenhum resultado Allure encontrado para products
                                    exit /b 0
                                )
                                npx allure generate allure-results/products -o allure-report/products --clean --single-file
                                if not exist allure-report/products/index.html (
                                    echo index.html nao foi gerado para products
                                    exit /b 1
                                )
                                '''
                                if (testStatus != 0) {
                                    error('Products tests failed')
                                }
                            }
                        }
                    }
                }

                stage('Cart') {
                    steps {
                        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                            script {
                                def testStatus = bat(
                                    returnStatus: true,
                                    script: '''
                                    if not exist allure-report mkdir allure-report
                                    npx cucumber-js --config cucumber.mjs --profile cart
                                    '''
                                )
                                bat '''
                                dir /b allure-results/cart/*-result.json >nul 2>nul
                                if errorlevel 1 (
                                    echo Nenhum resultado Allure encontrado para cart
                                    exit /b 0
                                )
                                npx allure generate allure-results/cart -o allure-report/cart --clean --single-file
                                if not exist allure-report/cart/index.html (
                                    echo index.html nao foi gerado para cart
                                    exit /b 1
                                )
                                '''
                                if (testStatus != 0) {
                                    error('Cart tests failed')
                                }
                            }
                        }
                    }
                }

                stage('Checkout') {
                    steps {
                        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                            script {
                                def testStatus = bat(
                                    returnStatus: true,
                                    script: '''
                                    if not exist allure-report mkdir allure-report
                                    npx cucumber-js --config cucumber.mjs --profile checkout
                                    '''
                                )
                                bat '''
                                dir /b allure-results/checkout/*-result.json >nul 2>nul
                                if errorlevel 1 (
                                    echo Nenhum resultado Allure encontrado para checkout
                                    exit /b 0
                                )
                                npx allure generate allure-results/checkout -o allure-report/checkout --clean --single-file
                                if not exist allure-report/checkout/index.html (
                                    echo index.html nao foi gerado para checkout
                                    exit /b 1
                                )
                                '''
                                if (testStatus != 0) {
                                    error('Checkout tests failed')
                                }
                            }
                        }
                    }
                }

                stage('Admin Access') {
                    steps {
                        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                            script {
                                def testStatus = bat(
                                    returnStatus: true,
                                    script: '''
                                    if not exist allure-report mkdir allure-report
                                    npx cucumber-js --config cucumber.mjs --profile adminAccess
                                    '''
                                )
                                bat '''
                                dir /b allure-results/admin-access/*-result.json >nul 2>nul
                                if errorlevel 1 (
                                    echo Nenhum resultado Allure encontrado para admin-access
                                    exit /b 0
                                )
                                npx allure generate allure-results/admin-access -o allure-report/admin-access --clean --single-file
                                if not exist allure-report/admin-access/index.html (
                                    echo index.html nao foi gerado para admin-access
                                    exit /b 1
                                )
                                '''
                                if (testStatus != 0) {
                                    error('Admin Access tests failed')
                                }
                            }
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
            archiveArtifacts artifacts: 'allure-results/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
        }
    }
}
