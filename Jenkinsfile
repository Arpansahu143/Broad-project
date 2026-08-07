pipeline {
    agent any
    stages {
        stage('Test Credential') {
            steps {
                withCredentials([string(credentialsId: 'sonarqube-token', variable: 'TOKEN')]) {
                    sh '''
                        if [ -z "$TOKEN" ]; then
                            echo "TOKEN IS EMPTY"
                        else
                            echo "TOKEN EXISTS"
                            echo "Length: ${#TOKEN}"
                        fi
                    '''
                }
            }
        }
    }
}