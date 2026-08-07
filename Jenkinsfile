pipeline {

    agent any

    options {
        skipDefaultCheckout(true)
        timestamps()
    }

    environment {
        BACKEND_IMAGE = "arpansahu/mis-backend:v1"
        FRONTEND_IMAGE = "arpansahu/mis-frontend:v1"
    }

    stages {

        stage('Checkout Source') {
            steps {
                echo "Checking out source code..."
                checkout scm
            }
        }

        stage('Build Backend Image') {
            steps {
                echo "Building Backend Docker Image..."
                sh """
                    docker build \
                    -t ${BACKEND_IMAGE} \
                    ./backend
                """
            }
        }

        stage('Build Frontend Image') {
            steps {
                echo "Building Frontend Docker Image..."
                sh """
                    docker build \
                    -t ${FRONTEND_IMAGE} \
                    ./frontend
                """
            }
        }

        stage('Docker Login') {
            steps {
                echo "Logging into Docker Hub..."

                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_PASSWORD" | docker login \
                        -u "$DOCKER_USERNAME" \
                        --password-stdin
                    '''
                }
            }
        }

        stage('Push Images') {
            steps {
                echo "Pushing Docker Images..."

                sh """
                    docker push ${BACKEND_IMAGE}
                    docker push ${FRONTEND_IMAGE}
                """
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(credentials: ['ec2-ssh']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@15.252.73.205 '
                            cd ~/university-mis &&
                            docker compose pull &&
                            docker compose down &&
                            docker compose up -d &&
                            docker ps
                        '
                    """
                }
            }
        }
    }

    post {

        success {
            echo "=================================="
            echo "CI/CD Pipeline Completed Successfully"
            echo "=================================="
        }

        failure {
            echo "=================================="
            echo "Pipeline Failed"
            echo "=================================="
        }

        always {
            sh 'docker logout || true'
        }
    }
}