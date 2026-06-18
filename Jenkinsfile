pipeline {

    agent any

    tools {
        nodejs 'NodeJS-20'
    }

    options {
        timestamps()
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

        stage('Login Feature') {
            steps {
                sh 'npx cucumber-js features/login.feature'
            }
        }

        stage('Products Feature') {
            steps {
                sh 'npx cucumber-js features/products.feature'
            }
        }

        stage('Cart Feature') {
            steps {
                sh 'npx cucumber-js features/cart.feature'
            }
        }

        stage('Checkout Feature') {
            steps {
                sh 'npx cucumber-js features/checkout.feature'
            }
        }

        stage('Admin Access Feature') {
            steps {
                sh 'npx cucumber-js features/admin-access.feature'
            }
        }
    }

    post {

        always {
            archiveArtifacts(
                artifacts: '**/*.png, **/*.log',
                allowEmptyArchive: true
            )
        }

        success {
            echo '✅ Todos os cenários passaram'
        }

        failure {
            echo '❌ Existem falhas nos testes'
        }
    }
}