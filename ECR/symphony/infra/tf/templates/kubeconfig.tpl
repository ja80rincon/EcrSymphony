apiVersion: v1
kind: Config
preferences: {}
clusters:
- cluster:
    server: ${cluster_endpoint}
    certificate-authority-data: ${cluster_auth_data}
  name: ${cluster_name}
contexts:
- context:
    cluster: ${cluster_name}
    namespace: ${cluster_namespace}
    user: ${cluster_name}
  name: ${cluster_name}
current-context: ${cluster_name}
users:
- name: ${cluster_name}
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1alpha1
      command: aws
      args:
        - eks
        - get-token
        - --cluster-name
        - ${eks_cluster_name}
        - --role-arn
        - ${assume_role_arn}
        - --region
        - ${region}
