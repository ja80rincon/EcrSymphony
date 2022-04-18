resource "kubernetes_namespace" "symphony" {
  metadata {
    name = "symphony"
  }
}

resource "kubernetes_role_binding" "symphony_admins" {
  metadata {
    name      = "admins"
    namespace = kubernetes_namespace.symphony.id
  }

  role_ref {
    kind      = "ClusterRole"
    name      = "cluster-admin"
    api_group = "rbac.authorization.k8s.io"
  }

  subject {
    kind      = "Group"
    name      = "symphony:masters"
    api_group = "rbac.authorization.k8s.io"
  }
}

resource "kubernetes_secret" "artifactory" {
  metadata {
    name      = "artifactory"
    namespace = kubernetes_namespace.symphony.id
  }

  data = {
    ".dockercfg" = jsonencode({
      (module.artifactory_secret.data.docker_registry) = {
        username = module.artifactory_secret.data.username
        password = module.artifactory_secret.data.password
        email    = module.artifactory_secret.data.email
      },
    })
  }

  type = "kubernetes.io/dockercfg"
}
