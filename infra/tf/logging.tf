resource "helm_release" "log_forwarder" {
  name       = "log-forwarder"
  namespace  = kubernetes_namespace.symphony.id
  repository = local.helm_repository.bitnami
  chart      = "fluentd"
  version    = "3.0.0"

  values = [yamlencode({
    nameOverride = "log-forwarder"
    aggregator = {
      configFile = "log-forwarder.conf"
      configMap  = kubernetes_config_map.log_forwarder.metadata.0.name
    }
    forwarder = {
      enabled = false
    }
    metrics = {
      enabled = true
      serviceMonitor = {
        enabled = true
      }
    }
  })]
}

resource "kubernetes_config_map" "log_forwarder" {
  metadata {
    name      = "log-forwarder"
    namespace = kubernetes_namespace.symphony.id
  }

  data = {
    "log-forwarder.conf" = file("${path.module}/files/log-forwarder.conf")
  }
}

resource "helm_release" "logging_pipeline" {
  name       = "logging-pipeline"
  namespace  = kubernetes_namespace.symphony.id
  repository = local.helm_repository.kiwigrid
  chart      = "any-resource"

  values = [yamlencode({
    anyResources = {
      Flow = yamlencode({
        apiVersion = "logging.banzaicloud.io/v1beta1"
        kind       = "Flow"
        metadata   = { name = "all-pods" }
        spec = {
          filters = [
            { tag_normaliser = {} },
            { dedot = { de_dot_nested = true } },
            { record_modifier = { remove_keys = "ts" } },
          ]
          match = [{
            select = {}
          }]
          localOutputRefs = ["es-output"]
        }
      })
      Output = yamlencode({
        apiVersion = "logging.banzaicloud.io/v1beta1"
        kind       = "Output"
        metadata   = { name = "es-output" }
        spec = {
          elasticsearch = {
            host               = data.terraform_remote_state.core.outputs.es.endpoint
            port               = 443
            scheme             = "https"
            ssl_version        = "TLSv1_2"
            logstash_format    = true
            logstash_prefix    = "symphony"
            log_es_400_reason  = true
            reconnect_on_error = true
            reload_connections = true
            buffer = {
              timekey         = "1m"
              timekey_wait    = "30s"
              timekey_use_utc = true
            }
          }
        }
      })
    }
  })]
}
