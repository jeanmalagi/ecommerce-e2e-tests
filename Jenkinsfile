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

        stage('Features') {

            parallel {

                stage('Login') {
                    steps {
                        bat '''
                        npx cucumber-js tests/features/login.feature ^
                        --import "tests/steps/**/*.mjs" ^
                        --import "tests/support/**/*.mjs"
                        '''
                    }
                }

                stage('Products') {
                    steps {
                        bat '''
                        npx cucumber-js tests/features/products.feature ^
                        --import "tests/steps/**/*.mjs" ^
                        --import "tests/support/**/*.mjs"
                        '''
                    }
                }

                stage('Cart') {
                    steps {
                        bat '''
                        npx cucumber-js tests/features/cart.feature ^
                        --import "tests/steps/**/*.mjs" ^
                        --import "tests/support/**/*.mjs"
                        '''
                    }
                }

                stage('Checkout') {
                    steps {
                        bat '''
                        npx cucumber-js tests/features/checkout.feature ^
                        --import "tests/steps/**/*.mjs" ^
                        --import "tests/support/**/*.mjs"
                        '''
                    }
                }

                stage('Admin Access') {
                    steps {
                        bat '''
                        npx cucumber-js tests/features/admin-access.feature ^
                        --import "tests/steps/**/*.mjs" ^
                        --import "tests/support/**/*.mjs"
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
            archiveArtifacts artifacts: '**/*.png, **/*.log', allowEmptyArchive: true
        }
    }
}