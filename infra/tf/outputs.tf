output "kubeconfig" {
  description = "kubectl config file contents for this EKS cluster."
  value = templatefile("${path.module}/templates/kubeconfig.tpl", {
    cluster_name      = "symphony-${terraform.workspace}"
    cluster_namespace = kubernetes_namespace.symphony.id
    eks_cluster_name  = data.aws_eks_cluster.current.name
    cluster_endpoint  = data.aws_eks_cluster.current.endpoint
    cluster_auth_data = data.aws_eks_cluster.current.certificate_authority.0.data
    assume_role_arn   = try(module.team[0].role_arn, data.aws_iam_role.team_role[0].arn)
    region            = data.aws_region.current.name
  })
  sensitive = true
}

output "symphony_tag" {
  description = "Symphony tag currently deployed"
  value       = local.symphony_tag
}

output "keycloak_admin" {
  description = "Keycloak login credentials"
  value = {
    user     = local.keycloak_user
    password = random_password.keycloak_admin.result
  }
  sensitive = true
}
