pipeline {

    agent any

    tools {
        nodejs 'NodeJS-20'
    }

    options {
        timestamps()
    }

    stage('E2E Tests') {
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

            stage('Admin') {
                steps {
                    sh 'npx cucumber-js features/admin-access.feature'
                }
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