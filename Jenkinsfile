pipeline {

    agent any

    options {
        skipDefaultCheckout(true)
        timestamps()
    }

    environment {
        BACKEND_IMAGE_BASE = "arpansahu/mis-backend"
        FRONTEND_IMAGE_BASE = "arpansahu/mis-frontend"
        // Every build gets its own tag (traceable, rollback-able),
        // and we also push :latest so the EC2 deploy step always has
        // one stable tag to pull without needing to know build numbers.
        BACKEND_IMAGE = "${BACKEND_IMAGE_BASE}:${BUILD_NUMBER}"
        FRONTEND_IMAGE = "${FRONTEND_IMAGE_BASE}:${BUILD_NUMBER}"
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
                    -t ${BACKEND_IMAGE_BASE}:latest \
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
                    -t ${FRONTEND_IMAGE_BASE}:latest \
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
                    docker push ${BACKEND_IMAGE_BASE}:latest
                    docker push ${FRONTEND_IMAGE}
                    docker push ${FRONTEND_IMAGE_BASE}:latest
                """
            }
        }

        stage('Deploy to EC2') {
            steps {
                echo "Deploying to EC2 via SSH..."

                withCredentials([
                    string(credentialsId: 'ec2-host', variable: 'EC2_HOST'),
                    string(credentialsId: 'ec2-user', variable: 'EC2_USER'),
                    string(credentialsId: 'ec2-project-path', variable: 'EC2_PROJECT_PATH')
                ]) {
                    sshagent(credentials: ['ec2-deploy-key']) {
                        sh '''
                            ssh -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" "
                                cd $EC2_PROJECT_PATH &&
                                git pull origin master &&
                                docker compose -f docker-compose.prod.yml pull &&
                                docker compose -f docker-compose.prod.yml up -d &&
                                docker image prune -f
                            "
                        '''
                    }
                }
            }
        }
    }

    post {

        success {
            echo "=================================="
            echo "CI Pipeline Completed Successfully"
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