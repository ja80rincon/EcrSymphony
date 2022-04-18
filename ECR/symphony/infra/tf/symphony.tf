locals {
  symphony_name   = "symphony"
  symphony_tag    = var.symphony_tag != null ? var.symphony_tag : data.terraform_remote_state.current.outputs.symphony_tag
  graph_event_url = "nats://graph.event"
  nats_server_envar = {
    name  = "NATS_SERVER_URL"
    value = data.terraform_remote_state.core.outputs.eks.nats_server_url
  }
}

module "store_role" {
  source                    = "./modules/irsa"
  role_name_prefix          = "SymphonyStoreRole"
  role_path                 = data.terraform_remote_state.core.outputs.eks.sa_role_path
  role_policy               = data.aws_iam_policy_document.store.json
  service_account_name      = "${local.symphony_name}-store"
  service_account_namespace = kubernetes_namespace.symphony.id
  oidc_provider_arn         = data.terraform_remote_state.core.outputs.eks.oidc_provider_arn
  tags                      = local.tags
}

data "aws_iam_policy_document" "store" {
  statement {
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
    ]

    resources = [
      "${aws_s3_bucket.store.arn}/*",
    ]
  }
}

module "async_role" {
  source                    = "./modules/irsa"
  role_name_prefix          = "SymphonyAsyncRole"
  role_path                 = data.terraform_remote_state.core.outputs.eks.sa_role_path
  role_policy               = data.aws_iam_policy_document.async.json
  service_account_name      = "${local.symphony_name}-async"
  service_account_namespace = kubernetes_namespace.symphony.id
  oidc_provider_arn         = data.terraform_remote_state.core.outputs.eks.oidc_provider_arn
  tags                      = local.tags
}

data "aws_iam_policy_document" "async" {
  statement {
    actions = [
      "s3:PutObject",
      "s3:PutObjectTagging",
    ]

    resources = [
      "${aws_s3_bucket.store.arn}/*/${local.store_exports_path}*",
    ]
  }
  statement {
    actions = [
      "s3:GetObject",
    ]
    resources = [
      "${aws_s3_bucket.store.arn}/*",
    ]
  }
}

resource "helm_release" "symphony" {
  name                = local.symphony_name
  namespace           = kubernetes_namespace.symphony.id
  chart               = "symphony"
  repository          = local.helm_repository.symphony.url
  repository_username = local.helm_repository.symphony.username
  repository_password = local.helm_repository.symphony.password
  version             = "4.4.0"
  timeout             = 600
  max_history         = 100

  values = [
    yamlencode({
      for s in toset(["admin", "graph", "async", "store", "migrate"]) :
      s => {
        spec = {
          log = {
            level = "debug"
          }
        }
      }
    }),
    yamlencode({
      for s in [
        { name = "front", replicas = 2 },
        { name = "admin", replicas = 1 },
        { name = "graph", replicas = 6 },
        { name = "async", replicas = 1 },
        { name = "store", replicas = 1 },
      ] :
      s.name => merge(
        {
          replicas = s.replicas
          podDisruptionBudget = {
            enabled = true
          }
          deploymentAnnotations = {
            "sidecar.jaegertracing.io/inject" = "true"
          }
        },
        s.replicas == 1 ? {
          updateStrategy = {
            type = "RollingUpdate"
            rollingUpdate = {
              maxSurge       = 1
              maxUnavailable = 0
            }
          }
        } : {},
      )
    }),
    yamlencode({
      global = {
        image = {
          registry = module.artifactory_secret.data.docker_registry
          tag      = local.symphony_tag
        }
        imagePullSecrets = [{
          name = kubernetes_secret.artifactory.metadata.0.name
        }]
      }
      ingress = {
        enabled = true
        annotations = {
          "kubernetes.io/ingress.class"                 = "nginx"
          "nginx.ingress.kubernetes.io/proxy-body-size" = "10m"
        }
        hosts = ["*.${local.domain_name}"]
        paths = ["/"]
      }
      serviceMonitor = {
        enabled = true
        alerting = {
          rules = yamldecode(
            templatefile("${path.module}/templates/symphony-alerts.tpl", {
              name      = local.symphony_name
              namespace = kubernetes_namespace.symphony.id
            }),
          )
        }
      }
      tracing = {
        enabled = true
        jaeger = {
          agentEndpoint       = "localhost:6831"
          agentThriftEndpoint = "localhost:6832"
        }
        excludeSpanNames = [
          "gocloud.dev/pubsub.driver.Subscription.ReceiveBatch",
        ]
      }
      persistence = {
        database = {
          scheme = "awsmysql"
          host   = module.graph_db.this_db_instance_address
          port   = module.graph_db.this_db_instance_port
          user   = module.graph_db.this_db_instance_username
          params = {
            charset           = "utf8"
            parseTime         = "true"
            interpolateParams = "true"
          }
        }
      }
      front = {
        spec = {
          proxy = {
            logger = format("%s-aggregator.%s.svc.cluster.local:9880",
              helm_release.log_forwarder.name, helm_release.log_forwarder.namespace,
            )
          }
          mysql = {
            host = module.front_db.this_db_instance_address
            port = module.front_db.this_db_instance_port
            user = module.front_db.this_db_instance_username
            db   = "auth"
          }
        }
      }
      graph = {
        spec = {
          tenancy = {
            tenantMaxDBConn = 1000
          }
          event = {
            url = local.graph_event_url
          }
          extraEnvVars = [
            local.nats_server_envar
          ]
        }
      }
      migrate = {
        spec = {
          migrations = {
            cadence = {
              address = "${local.cadence.frontend_name}:${local.cadence.frontend_port}",
              extraEnvVars = [
                local.cadence.env_var
              ]
            }
          }
        }
      }
      async = {
        serviceAccount = {
          name = module.async_role.service_account_name
          annotations = {
            "eks.amazonaws.com/role-arn" = module.async_role.role_arn
          }
        }
        spec = {
          tenancy = {
            tenantMaxDBConn = 5
          }
          event = {
            pub_url = local.graph_event_url
            sub_url = "${local.graph_event_url}?queue=async"
          }
          export = {
            bucket_url    = local.store_bucket_url
            bucket_prefix = local.store_exports_path
          }
          cadence = {
            address = "${local.cadence.frontend_name}:${local.cadence.frontend_port}"
          }
          extraEnvVars = [
            local.nats_server_envar
          ]
        }
      }
      store = {
        serviceAccount = {
          name = module.store_role.service_account_name
          annotations = {
            "eks.amazonaws.com/role-arn" = module.store_role.role_arn
          }
        }
        spec = {
          bucket = {
            url = local.store_bucket_url
          }
        }
      }
      docs = {
        resources = {
          limits = {
            cpu    = "50m"
            memory = "64Mi"
          }
        }
      }
      jobrunner = {
        resources = {
          limits = {
            cpu    = "10m"
            memory = "64Mi"
          }
        }
      }
    }),
  ]

  set_sensitive {
    name  = "front.spec.session_token"
    value = module.front_secret.data.session_token
  }
  set_sensitive {
    name  = "front.spec.mapbox.access_token"
    value = module.front_secret.data.mapbox_access_token
  }
  set_sensitive {
    name  = "front.spec.mysql.pass"
    value = module.front_db.this_db_instance_password
  }
  set_sensitive {
    name  = "persistence.database.pass"
    value = module.graph_db.this_db_instance_password
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "kubernetes_cron_job" "tenant_cleaner" {
  for_each = terraform.workspace == "staging" ? {
    testimio = {
      schedule = "25,55 * * * *"
    }
  } : {}

  metadata {
    name      = "${local.symphony_name}-${each.key}-cleaner"
    namespace = kubernetes_namespace.symphony.id
  }

  spec {
    concurrency_policy            = "Forbid"
    successful_jobs_history_limit = 0
    schedule                      = each.value.schedule

    job_template {
      metadata {}
      spec {
        template {
          metadata {
            labels = {
              format("%s-admin-client", local.symphony_name) = "true"
            }
          }
          spec {
            container {
              name  = "${local.symphony_name}-${each.key}-cleaner"
              image = "curlimages/curl"
              command = [
                "/bin/sh",
                "-c",
                format(
                  "curl -s -H 'Content-Type: application/json' -d '{\"query\":\"mutation TruncateTenant {truncateTenant(input: {name: \\\"%s\\\"}) {clientMutationId}}\"}' http://%s-admin.%s.svc.cluster.local/query",
                  each.key, local.symphony_name, kubernetes_namespace.symphony.id,
                ),
              ]
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_config_map" "dashboards" {
  metadata {
    name      = "grafana-dashboards"
    namespace = kubernetes_namespace.symphony.id

    labels = {
      grafana_dashboard = "1"
    }
  }

  data = {
    for f in fileset("${path.module}/dashboards", "*") :
    f => file("${path.module}/dashboards/${f}")
  }
}
