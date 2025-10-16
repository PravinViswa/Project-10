//just a Mock CI/CD Pipeline:)

pipeline{
    agent any

    environment{
        AWS_REGION="eu-north-1"
        DYNAMO_TABLE_NAME ="2048Game"
    }

    stages{
        stage('Build Frontend'){
            steps{
                dir('frontend'){
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
        stage('Build Backend'){
            steps{
                dir('backend'){
                    sh 'cargo build --release'
                }
            }
        }
        stage('Docker Build and Push'){
            steps {
                script{
                    docker.withRegistry('https://demo.com','demo'){
                        def frontendImage = docker.build('repo/frontend-2048:latest','./frontend')
                        frontendImage.push()
                        def backendImage = docker.build('repo/backend-2048:latest','./backend')
                        backendImage.push()
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying application...'
            }
        }
    }
}