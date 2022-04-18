resource "random_password" "keycloak_dbpass" {
  length  = 16
  special = false
}

module "keycloak_db" {
  source  = "terraform-aws-modules/rds/aws"
  version = "~> 2.0"

  identifier                 = "keycloak"
  family                     = "mysql5.7"
  major_engine_version       = "5.7"
  engine                     = "mysql"
  engine_version             = "5.7"
  auto_minor_version_upgrade = true
  instance_class             = "db.t2.small"
  allocated_storage          = 16

  name     = "keycloak"
  username = local.db_user
  password = random_password.keycloak_dbpass.result
  port     = local.mysql_port

  maintenance_window      = "Mon:00:00-Mon:03:00"
  backup_window           = "03:00-06:00"
  backup_retention_period = 7
  deletion_protection     = true
  skip_final_snapshot     = false

  monitoring_role_arn = data.aws_iam_role.rds_monitoring.arn
  monitoring_interval = 60

  vpc_security_group_ids = [data.terraform_remote_state.core.outputs.database.security_group_ids.mysql]
  subnet_ids             = data.terraform_remote_state.core.outputs.database.subnets
  db_subnet_group_name   = data.terraform_remote_state.core.outputs.database.subnet_group

  tags = local.tags
}

locals {
  keycloak_user = "admin"
}

resource "random_password" "keycloak_admin" {
  length  = 16
  special = false
}

resource "helm_release" "keycloak" {
  name       = "keycloak"
  namespace  = kubernetes_namespace.symphony.id
  chart      = "keycloak"
  repository = local.helm_repository.codecentric
  version    = "9.5.0"

  values = [yamlencode({
    replicas            = 2
    podDisruptionBudget = { minAvailable = 1 }
    ingress = {
      enabled = true
      annotations = {
        "kubernetes.io/ingress.class"                     = "nginx"
        "nginx.ingress.kubernetes.io/affinity"            = "cookie"
        "nginx.ingress.kubernetes.io/session-cookie-name" = "AUTH_SESSION_ID"
      }
      rules = [{
        host  = "auth.${local.domain_name}"
        paths = ["/"]
      }]
      tls = []
    }
    extraEnv = yamlencode([
      { name = "KEYCLOAK_USER", value = local.keycloak_user },
      { name = "KEYCLOAK_STATISTICS", value = "all" },
      { name = "JDBC_PARAMS", value = "useSSL=false" },
      { name = "PROXY_ADDRESS_FORWARDING", value = "true" },
      { name = "DB_VENDOR", value = "mysql" },
      { name = "DB_ADDR", value = module.keycloak_db.this_db_instance_address },
      { name = "DB_PORT", value = tostring(module.keycloak_db.this_db_instance_port) },
      { name = "DB_USER", value = module.keycloak_db.this_db_instance_username },
    ])
    extraEnvFrom = yamlencode([
      { secretRef = { name = "keycloak-http" } },
      { secretRef = { name = "keycloak-db" } },
    ])
    serviceMonitor = { enabled = true }
    postgresql     = { enabled = false }
    test           = { enabled = false }
  })]

  set_sensitive {
    name  = "secrets.http.stringData.KEYCLOAK_PASSWORD"
    value = random_password.keycloak_admin.result
  }

  set_sensitive {
    name  = "secrets.db.stringData.DB_PASSWORD"
    value = module.keycloak_db.this_db_instance_password
  }
}
