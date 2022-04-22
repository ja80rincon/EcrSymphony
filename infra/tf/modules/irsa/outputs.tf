output "role_arn" {
  description = "ARN of IAM role"
  value       = aws_iam_role.this_role.arn
}

output "role_name" {
  description = "Name of IAM role"
  value       = aws_iam_role.this_role.name
}

output "role_path" {
  description = "Path of IAM role"
  value       = aws_iam_role.this_role.path
}

output "service_account_name" {
  description = "Name of service account"
  value       = var.service_account_name
}

output "service_account_namespace" {
  description = "Namespace of service account"
  value       = var.service_account_namespace
}
