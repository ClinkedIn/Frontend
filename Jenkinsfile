pipeline {
    agent any
    environment {
        dockerHub = credentials('lockedin-dockerhub')
    }
    stages {
        stage('cp env file'){
            when {
                anyOf {
                    changeRequest target: 'main'
                    branch 'main'
                }
            }
            steps {
                sh 'cp /home/jenkins/.env .'
            }
        }

        stage('Build & test') {
            when {
                anyOf {
                    changeRequest target: 'main'
                    branch 'main'
                }
            }
            steps {
                 sh "docker build . -t ${env.dockerHub_USR}/lockedin_frontend"
            }
        }

        stage('push to registery') {
            when{
                branch 'main'
            }
            steps {
                sh "docker login -u ${env.dockerHub_USR} -p ${env.dockerHub_PSW}"
                sh "docker push ${env.dockerHub_USR}/lockedin_frontend"
            }
        }

        stage('rebuild docker compose'){
            when{
                branch 'main'
            }
            steps {
                sh "/home/jenkins/pull_image.sh ${env.dockerHub_USR}  ${env.dockerHub_PSW} frontend"
            }
        }
    }
}
