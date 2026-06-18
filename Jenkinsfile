pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verificar Ambiente') {
            steps {
                bat 'node -v'
                bat 'npm -v'
            }
        }

        stage('Instalar Dependências') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Features') {
            parallel {

                stage('Login') {
                    steps {
                        bat 'npx cucumber-js features/login.feature'
                    }
                }

                stage('Products') {
                    steps {
                        bat 'npx cucumber-js features/products.feature'
                    }
                }

                stage('Cart') {
                    steps {
                        bat 'npx cucumber-js features/cart.feature'
                    }
                }

                stage('Checkout') {
                    steps {
                        bat 'npx cucumber-js features/checkout.feature'
                    }
                }

                stage('Admin') {
                    steps {
                        bat 'npx cucumber-js features/admin-access.feature'
                    }
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: '**/*.log', allowEmptyArchive: true
        }
    }
}