variable "role_name" {
  description = "IAM role name"
  type        = string
  default     = null
}

variable "role_name_prefix" {
  description = "IAM role name prefix"
  type        = string
  default     = null
}

variable "role_policy" {
  description = "IAM role policy"
  type        = string
  default     = null
}

variable "role_policy_arns" {
  description = "List of ARNs of IAM policies to attach to IAM role"
  type        = list(string)
  default     = null
}

variable "role_path" {
  description = "Path of IAM role"
  type        = string
  default     = null
}

variable "role_max_session_duration" {
  description = "Maximum CLI/API session duration in seconds between 3600 and 43200"
  type        = number
  default     = null
}

variable "role_permissions_boundary_arn" {
  description = "Permissions boundary ARN to use for IAM role"
  type        = string
  default     = null
}

variable "service_account_name" {
  description = "Name of service account"
  type        = string
}

variable "service_account_namespace" {
  description = "Namespace of service account"
  type        = string
}

variable "oidc_provider_arn" {
  description = "ARN of OIDC provider"
  type        = string
}

variable "tags" {
  description = "A map of tags to add to IAM role resources"
  type        = map(string)
  default     = null
}
