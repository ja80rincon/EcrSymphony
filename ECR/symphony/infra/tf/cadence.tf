resource "random_password" "cadence_db" {
  length  = 16
  special = false
}

module "cadence_db" {
  source  = "terraform-aws-modules/rds/aws"
  version = "~> 2.0"

  family                      = "mysql8.0"
  major_engine_version        = "8.0"
  engine                      = "mysql"
  engine_version              = "8.0.20"
  allow_major_version_upgrade = true
  auto_minor_version_upgrade  = true
  instance_class              = "db.r5.4xlarge"
  multi_az                    = true
  allocated_storage           = 100

  identifier = "cadence"
  username   = local.db_user
  password   = random_password.cadence_db.result
  port       = local.mysql_port

  maintenance_window           = "Mon:00:00-Mon:03:00"
  backup_window                = "03:00-06:00"
  backup_retention_period      = 35
  deletion_protection          = true
  skip_final_snapshot          = false
  performance_insights_enabled = true

  monitoring_role_arn = data.aws_iam_role.rds_monitoring.arn
  monitoring_interval = 60

  vpc_security_group_ids = [data.terraform_remote_state.core.outputs.database.security_group_ids.mysql]
  subnet_ids             = data.terraform_remote_state.core.outputs.database.subnets
  db_subnet_group_name   = data.terraform_remote_state.core.outputs.database.subnet_group

  parameters = [
    {
      name  = "max_connect_errors"
      value = 10000
    },
    {
      name  = "max_execution_time",
      value = 10000
    },
    {
      name  = "innodb_file_per_table",
      value = 0
    },
  ]

  tags = local.tags
}

resource "kubernetes_job" "create-cadence-db" {
  metadata {
    name      = "create-cadence-db"
    namespace = kubernetes_namespace.symphony.id
  }
  spec {
    completions             = 1
    active_deadline_seconds = 60
    template {
      metadata {}
      spec {
        container {
          name  = "create-cadence-db"
          image = "mysql"
          command = [
            "mysql",
            format("--host=%s", module.cadence_db.this_db_instance_address),
            format("--user=%s", module.cadence_db.this_db_instance_username),
            format("--password=%s", module.cadence_db.this_db_instance_password),
            "--execute=CREATE DATABASE IF NOT EXISTS cadence;CREATE DATABASE IF NOT EXISTS cadence_visibility;",
          ]
        }
        restart_policy = "Never"
      }
    }
  }
  wait_for_completion = true
}

locals {
  cadence = {
    frontend_name = "cadence-frontend"
    frontend_port = "7933"
    env_var = {
      name  = "CADENCE_RETENTION"
      value = "3"
    }
  }
}

# cadence is a distributed, scalable, durable, and highly available orchestration engine to execute asynchronous long-running business logic in a scalable and resilient way
resource "helm_release" "cadence" {
  name       = "cadence"
  namespace  = kubernetes_namespace.symphony.id
  repository = local.helm_repository.banzaicloud
  chart      = "cadence"
  version    = "0.12.0"
  depends_on = [kubernetes_job.create-cadence-db]

  values = [yamlencode({
    server = {
      config = {
        persistence = {
          for s in [
            { name = "default", database = "cadence" },
            { name = "visibility", database = "cadence_visibility" },
          ] :
          s.name => {
            driver = "sql"
            sql = {
              pluginName = "mysql"
              host       = module.cadence_db.this_db_instance_address
              port       = module.cadence_db.this_db_instance_port
              database   = s.database
              user       = module.cadence_db.this_db_instance_username
            }
          }
        },
      }
      metrics = {
        serviceMonitor = {
          enabled = true
        }
      }
      frontend = {
        service = {
          port = local.cadence.frontend_port
        }
      }
    }
    cassandra = {
      enabled = false
    }
    web = {
      ingress = {
        enabled = true
        annotations = {
          "kubernetes.io/ingress.class" = "nginx"
        }
        hosts = ["cadence.${local.intern_domain_name}"]
      }
    }
  })]

  set_sensitive {
    name  = "server.config.persistence.default.sql.password"
    value = module.cadence_db.this_db_instance_password
  }

  set_sensitive {
    name  = "server.config.persistence.visibility.sql.password"
    value = module.cadence_db.this_db_instance_password
  }
}