terraform {
  required_version = ">= 0.13"

  backend "s3" {
    bucket               = "symphony.deployment"
    region               = "us-east-1"
    workspace_key_prefix = "symphony"
    key                  = "symphony/terraform.tfstate"
    dynamodb_table       = "symphony.tflock"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 2.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 1.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 1.0"
    }
  }
}

data "aws_region" "current" {}

locals {
  env = {
    staging = {
      region  = "eu-west-1"
      cluster = "phb-staging"
    }
    production = {
      region  = "us-east-1"
      cluster = "phb-default"
    }
  }
  production_only_count = terraform.workspace == "production" ? 1 : 0
}

data "terraform_remote_state" "current" {
  backend   = "s3"
  workspace = terraform.workspace

  config = {
    bucket               = "symphony.deployment"
    region               = "us-east-1"
    workspace_key_prefix = "symphony"
    key                  = "symphony/terraform.tfstate"
    dynamodb_table       = "symphony.tflock"
  }

  defaults = {
    symphony_tag  = "latest"
  }
}

locals {
  core_workspace = terraform.workspace != "production" ? terraform.workspace : "default"
}

data "terraform_remote_state" "core" {
  backend   = "s3"
  workspace = local.core_workspace

  config = {
    bucket               = "symphony.deployment"
    region               = "us-east-1"
    key                  = "terraform/terraform.tfstate"
    workspace_key_prefix = "terraform"
    dynamodb_table       = "symphony.terraform.lock"
  }
}

data "aws_eks_cluster" "staging" {
  name     = local.env.staging.cluster
  provider = aws.eu-west-1
}

data "aws_eks_cluster" "production" {
  name     = local.env.production.cluster
  provider = aws.us-east-1
}

data "aws_eks_cluster" "current" {
  name = local.env[terraform.workspace].cluster
}

data "aws_eks_cluster_auth" "current" {
  name     = data.aws_eks_cluster.current.name
  provider = aws.assume-admin-role
  count    = !var.bootstrap ? 1 : 0
}

data "aws_eks_cluster_auth" "bootstrap" {
  name  = data.aws_eks_cluster.current.name
  count = var.bootstrap ? 1 : 0
}

locals {
  eks_cluster_token = var.bootstrap ? data.aws_eks_cluster_auth.bootstrap[0].token : data.aws_eks_cluster_auth.current[0].token
}

locals {
  domain_name = format(
    "%sthesymphony.cloud",
    terraform.workspace != "production" ? "${terraform.workspace}." : "",
  )
  intern_domain_name = "intern.${local.domain_name}"

  tags = {
    Project   = "symphony"
    PartOf    = "symphony"
    Workspace = terraform.workspace
  }
}
