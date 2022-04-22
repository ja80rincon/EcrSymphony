locals {
  helm_repository = {
    symphony = {
      url      = module.artifactory_secret.data.helm_repository
      username = module.artifactory_secret.data.username
      password = module.artifactory_secret.data.password
    }
    codecentric = "https://codecentric.github.io/helm-charts"
    banzaicloud = "https://kubernetes-charts.banzaicloud.com"
    bitnami     = "https://charts.bitnami.com/bitnami"
    kiwigrid    = "https://kiwigrid.github.io"
  }
}
