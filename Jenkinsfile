pipeline {
    agent any
    stages {
        stage('install') {
            steps {
                withCredentials([file(credentialsId: 'TDA_front_env', variable: 'env')]) {
                    sh 'cp $env src/src/environments/environment.ts'
                    sh 'cp $env src/src/environments/environment.prod.ts'
                }
                sh 'cd src && yarn install'
            }
        }
        stage('build'){
            steps {
                sh 'cd src && ng build --prod --configuration production'
            }
        }
        stage('deploy') {
            steps {
                sh 'sudo rm -rf /var/www/html/tda-front'
                sh 'cp -r src/dist/TDA /var/www/html/tda-front'
                sh 'sudo chmod 755 -R /var/www/html/tda-front'
                sh 'sudo chown www-data -R /var/www/html/tda-front'
            }
        }
    }
    post {
        always {
           cleanWs()
        }
    }
}
