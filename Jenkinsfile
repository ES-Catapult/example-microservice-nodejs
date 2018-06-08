#!groovy

@Library('common-jenkins-scripts') _

node('default') {
  currentBuild.result = "SUCCESS"

  def serviceName = 'devops_playground'
  def nodeHome = tool name: 'node-6.10.2', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
  def shouldBuild = true
  def pipelineError = null
  def version = env.BUILD_NUMBER

  env.NODE_ENV = "test"
  env.MAKEFILE_SUDO_COMMAND = "sudo -n"
  env.RUN_AS_USER = "-u 2000:2000"
  env.PATH = "$env.PATH:$nodeHome/bin"

  sh 'printenv'

  if (env.BRANCH_NAME =~ /(?:feature)/) {
    version = env.BRANCH_NAME.replaceFirst(/^feature\//, "")
  }

  try {

        stage 'Checkout'

          checkout scm

          checkout([$class: 'GitSCM',
            branches: [[name: '*/master']],
            doGenerateSubmoduleConfigurations: false,
            extensions: [[
              $class: 'RelativeTargetDirectory',
              relativeTargetDir: 'devops'
            ]],
            submoduleCfg: [],
            userRemoteConfigs: [[
              credentialsId: "${GIT_JENKINS_CREDENTIALS_ID}",
              url: "${DEPLOYMENT_SCRIPTS_REPO_URL}"
            ]]
          ])

          result = sh (script: "git log --format=%s -1 | grep '^\\[ignore\\]'", returnStatus: true)

          if (result == 0) {
              shouldBuild = false
              currentBuild.result = 'ABORTED'
              error('skipping build!!!')
          }

        stage 'Install'

          sh 'make install'

        stage 'Dependency check'

          sh 'make dependency-check'

        stage 'Lint'

          sh 'make lint'

        stage 'Unit test'

          sh 'make unit-test'

        stage 'Build Docker image'

          buildWithDocker("${serviceName}", version)

        stage 'Component test'

          sh 'make component-test'

        if (env.BRANCH_NAME =~ /(?:develop|feature)/) {

          stage 'Push to ECR'

            pushContainerToRegistry("${serviceName}", version)

          stage 'Publish to NPM'

            publishNPMArtifact("${serviceName}", version, "devops_playground.gateway.energy", env.BRANCH_NAME)

        }

        try { notifyBuild(currentBuild.result) } catch(all){}

    } catch (err) {

        pipelineError = err

        if (shouldBuild == false) {
          return
        }

        currentBuild.result = "FAILURE"
        notifyBuild(currentBuild.result)

    } finally {

      try { sh 'make clean' } catch(all){}

      if (pipelineError) {
          throw pipelineError
      }
    }
}
