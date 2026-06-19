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
                                    if exist allure-results/login rmdir /s /q allure-results/login
                                    npx cucumber-js --config cucumber.mjs --profile login
                                    '''
                                )
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
                                    npx cucumber-js --config cucumber.mjs --profile products
                                    '''
                                )
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
                                    npx cucumber-js --config cucumber.mjs --profile cart
                                    '''
                                )
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
                                    npx cucumber-js --config cucumber.mjs --profile checkout
                                    '''
                                )
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
                                    npx cucumber-js --config cucumber.mjs --profile adminAccess
                                    '''
                                )
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
            script {
                def reportStatus = bat(
                    returnStatus: true,
                    script: '''
                    if exist allure-report rmdir /s /q allure-report
                    mkdir allure-report

                    for %%D in (login products cart checkout admin-access) do (
                        if exist "allure-results\\%%D\\*-result.json" (
                            echo Gerando report para %%D...
                            npx allure generate "allure-results\\%%D" -o "allure-report\\%%D" --clean
                            if not exist "allure-report\\%%D\\index.html" (
                                echo index.html nao foi gerado para %%D
                                exit /b 2
                            )
                            powershell -NoProfile -ExecutionPolicy Bypass -Command "Compress-Archive -Path 'allure-report/%%D/*' -DestinationPath 'allure-report/%%D-report.zip' -Force"
                        ) else (
                            echo Nenhum resultado Allure encontrado para %%D
                        )
                    )

                    echo Indexes gerados:
                    for /r allure-report %%F in (index.html) do @echo %%F
                    echo Zips gerados:
                    dir /b allure-report/*-report.zip
                    exit /b 0
                    '''
                )

                if (reportStatus != 0) {
                    echo 'Aviso: geracao de algum report Allure falhou.'
                }
            }
            archiveArtifacts artifacts: 'allure-results/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
        }
    }
}
