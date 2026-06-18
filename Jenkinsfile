pipeline {

    agent any

    tools {
        nodejs 'NodeJS-20'
    }

    options {
        timestamps()
        ansiColor('xterm')
        disableConcurrentBuilds()
    }

    environment {
        NODE_ENV = 'test'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Execute E2E Features') {

            parallel {

                stage('Login') {
                    steps {
                        sh 'npx cucumber-js features/login.feature'
                    }
                }

                stage('Products') {
                    steps {
                        sh 'npx cucumber-js features/products.feature'
                    }
                }

                stage('Cart') {
                    steps {
                        sh 'npx cucumber-js features/cart.feature'
                    }
                }

                stage('Checkout') {
                    steps {
                        sh 'npx cucumber-js features/checkout.feature'
                    }
                }

                stage('Admin Access') {
                    steps {
                        sh 'npx cucumber-js features/admin-access.feature'
                    }
                }
            }
        }
    }

    post {

        always {

            archiveArtifacts(
                artifacts: '''
                    reports/**/*,
                    screenshots/**/*,
                    videos/**/*,
                    logs/**/*
                '''.stripIndent(),
                allowEmptyArchive: true
            )

            junit(
                testResults: 'reports/**/*.xml',
                allowEmptyResults: true
            )
        }

        success {
            echo '✅ Todos os testes E2E executaram com sucesso.'
        }

        unstable {
            echo '⚠️ Existem testes com falha.'
        }

        failure {
            echo '❌ Pipeline falhou.'
        }

        cleanup {
            cleanWs()
        }
    }
}