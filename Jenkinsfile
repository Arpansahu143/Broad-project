pipeline {
    agent any

    stages {
        stage('Test Credential') {
            steps {
                withCredentials([
                    string(credentialsId: 'sonarqube-token', variable: 'TOKEN')
                ]) {
                    sh '''
                        echo "Length: ${#TOKEN}"
                    '''
                }
            }
        }
    }
}