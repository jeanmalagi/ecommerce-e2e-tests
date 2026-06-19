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
                            script {
                                def testStatus = bat(
                                    returnStatus: true,
                                    script: '''
                                    if exist allure-results/login rmdir /s /q allure-results/login
                                    if exist allure-report/login rmdir /s /q allure-report/login
                                    npx cucumber-js --config cucumber.mjs --profile login -f progress
                                    '''
                                )
                                bat '''
                                dir /b allure-results/login/*-result.json >nul 2>nul
                                if errorlevel 1 (
                                    echo Nenhum resultado Allure encontrado para login
                                    exit /b 0
                                )
                                npx allure generate allure-results/login -o allure-report/login --clean
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
                                    if exist allure-results/products rmdir /s /q allure-results/products
                                    if exist allure-report/products rmdir /s /q allure-report/products
                                    npx cucumber-js --config cucumber.mjs --profile products -f progress
                                    '''
                                )
                                bat '''
                                dir /b allure-results/products/*-result.json >nul 2>nul
                                if errorlevel 1 (
                                    echo Nenhum resultado Allure encontrado para products
                                    exit /b 0
                                )
                                npx allure generate allure-results/products -o allure-report/products --clean
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
                                    if exist allure-results/cart rmdir /s /q allure-results/cart
                                    if exist allure-report/cart rmdir /s /q allure-report/cart
                                    npx cucumber-js --config cucumber.mjs --profile cart -f progress
                                    '''
                                )
                                bat '''
                                dir /b allure-results/cart/*-result.json >nul 2>nul
                                if errorlevel 1 (
                                    echo Nenhum resultado Allure encontrado para cart
                                    exit /b 0
                                )
                                npx allure generate allure-results/cart -o allure-report/cart --clean
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
                                    if exist allure-results/checkout rmdir /s /q allure-results/checkout
                                    if exist allure-report/checkout rmdir /s /q allure-report/checkout
                                    npx cucumber-js --config cucumber.mjs --profile checkout -f progress
                                    '''
                                )
                                bat '''
                                dir /b allure-results/checkout/*-result.json >nul 2>nul
                                if errorlevel 1 (
                                    echo Nenhum resultado Allure encontrado para checkout
                                    exit /b 0
                                )
                                npx allure generate allure-results/checkout -o allure-report/checkout --clean
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
                                    if exist allure-results/admin-access rmdir /s /q allure-results/admin-access
                                    if exist allure-report/admin-access rmdir /s /q allure-report/admin-access
                                    npx cucumber-js --config cucumber.mjs --profile adminAccess -f progress
                                    '''
                                )
                                bat '''
                                dir /b allure-results/admin-access/*-result.json >nul 2>nul
                                if errorlevel 1 (
                                    echo Nenhum resultado Allure encontrado para admin-access
                                    exit /b 0
                                )
                                npx allure generate allure-results/admin-access -o allure-report/admin-access --clean
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
