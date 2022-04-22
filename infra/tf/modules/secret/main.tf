terraform {
  required_providers {
    sops = {
      source  = "carlpett/sops"
      version = "~> 0.5"
    }
  }
}

variable "override" {
  type    = any
  default = null
}

variable "path" {
  type    = string
  default = null
}

data "sops_file" "file" {
  source_file = var.path
  count       = var.override == null ? 1 : 0
}

output "data" {
  value = try(data.sops_file.file[0].data, var.override)
}
