pipeline {

    agent any

    environment {
        DOCKER_USERNAME = 'arpansahu'
        BACKEND_IMAGE = 'arpansahu/mis-backend:v1'
        FRONTEND_IMAGE = 'arpansahu/mis-frontend:v1'
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo 'Cloning repository...'
                checkout scm
            }
        }


        stage('Build Backend Image') {
            steps {
                echo 'Building backend Docker image...'
                sh 'docker build -t $BACKEND_IMAGE ./backend'
            }
        }


        stage('Build Frontend Image') {
            steps {
                echo 'Building frontend Docker image...'
                sh 'docker build -t $FRONTEND_IMAGE ./frontend'
            }
        }


        stage('Docker Login') {
            steps {
                echo 'Logging into Docker Hub...'
                sh '''
                docker login -u ${DOCKER_USERNAME} -p $DOCKER_PASSWORD
                '''
            }
        }


        stage('Push Images') {
            steps {
                echo 'Pushing images to Docker Hub...'
                sh '''
                docker push $BACKEND_IMAGE
                docker push $FRONTEND_IMAGE
                '''
            }
        }

    }


    post {

        success {
            echo 'CI Pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed!'
        }

    }
}