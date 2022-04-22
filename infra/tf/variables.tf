variable "bootstrap" {
  type        = bool
  description = "Run in bootstrap mode"
  default     = false
}

variable "symphony_tag" {
  type        = string
  description = "Symphony application image tag"
  default     = null
}

variable "artifactory" {
  description = "Artifactory urls and credentials"
  type = object({
    docker_registry = string
    helm_repository = string
    username        = string
    password        = string
    email           = string
  })
  default = null
}

variable "front_secret" {
  description = "Front secret override"
  type = object({
    session_token       = string
    mapbox_access_token = string
  })
  default = null
}
