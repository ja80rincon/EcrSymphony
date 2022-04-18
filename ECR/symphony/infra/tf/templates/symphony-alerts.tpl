- name: ${name}-alerts.rules
  rules:
%{ for items in [["warning", "1"], ["critical", "5"]] ~}
    - alert: SymphonyServiceHTTPErrorsHigh
      annotations:
        description: '{{ printf "%.2f" $value }}% of HTTP requests failed on {{ $labels.pod }}'
        summary: '{{ reReplaceAll "${name}-" "" $labels.job | title }} has many HTTP errors'
      expr: |-
        sum(rate(
          http_request_total{job=~"${name}-.*", namespace="${namespace}", http_status=~"5.."}[5m]
        )) without(http_method, http_path, http_status)
          /
        sum(rate(
          http_request_total{job=~"${name}-.*", namespace="${namespace}"}[5m]
        )) without(http_method, http_path, http_status) * 100 > ${items[1]}
      labels:
        severity: ${items[0]}
%{ endfor ~}
%{ for items in [["warning", "0.5"], ["critical", "1"]] ~}
    - alert: SymphonyServiceHTTPLatencyHigh
      annotations:
        description: '99th percentile of HTTP requests latency is {{ humanizeDuration $value }} on {{ $labels.pod }}'
        summary: '{{ reReplaceAll "${name}-" "" $labels.job | title }} has high HTTP request latency'
      expr: |-
        histogram_quantile(0.99,
          sum(rate(
            http_request_duration_milliseconds_bucket{job=~"${name}-.*", namespace="${namespace}"}[5m]
          ))
        ) * 1000 > ${items[1]}
      labels:
        severity: ${items[0]}
%{ endfor ~}
    - alert: SymphonyServiceSQLErrorsHigh
      annotations:
        description: '{{ printf "%.2f" $value }}% of SQL requests failed on {{ $labels.pod }}'
        summary: '{{ reReplaceAll "${name}-" "" $labels.job | title }} has many SQL errors'
      expr: |-
        sum(rate(
          go_sql_client_calls{job=~"${name}-.*", namespace="${namespace}", go_sql_status!="OK"}[5m]
        ))
          /
        sum(rate(
          go_sql_client_calls{job=~"${name}-.*", namespace="${namespace}"}[5m]
        )) * 100 > 5
      labels:
        severity: critical
    - alert: SymphonyServiceNearFDLimit
      annotations:
        description: '{{ printf "%.2f" $value }}% of file descriptors are in use on {{ $labels.pod }}'
        summary: '{{ reReplaceAll "${name}-" "" $labels.job | title }} is approaching fd limit'
      expr: |-
        process_open_fds{job=~"${name}-.*", namespace="${namespace}"}
          /
        process_max_fds{job=~"${name}-.*", namespace="${namespace}"} * 100 > 80
      for: 10m
      labels:
        severity: warning
    - alert: SymphonyServicePodRestart
      annotations:
        description: 'Pod {{ $labels.namespace }}/{{ $labels.pod }} was restarted'
        summary: '{{ reReplaceAll "${name}-" "" $labels.container | title }} was restarted'
      expr: |-
        rate(
          kube_pod_container_status_restarts_total{job="kube-state-metrics", pod=~"${name}-.*", namespace="${namespace}"}[1h]
        ) > 0
      labels:
        severity: warning
    - alert: SymphonyNoUpdate
      annotations:
        description: 'Chart "{{ $labels.chart }}" was last updated more then a day ago'
        summary: '{{ $labels.chart }} chart was not updated'
      expr: |-
        count(changes(
          helm_chart_info{chart="${name}", namespace="${namespace}"}[1d]
        )) by (chart) == 1
      labels:
        severity: warning
    - alert: SymphonyClientFatalError
      annotations:
        description: 'A large part of the UI cannot render due to a JS error'
        summary: 'Client fatal error occurred for tenant "{{ $labels.tenant }}"'
      expr: |-
        sum(increase(
            inventory_client_events_total{event="client_fatal_error", namespace="${namespace}"}[1d]
        )) by(tenant, event) > 0
      labels:
        severity: major