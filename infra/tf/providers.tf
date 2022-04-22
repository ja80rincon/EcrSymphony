provider "aws" {
  region = local.env[terraform.workspace].region
}

provider "aws" {
  region = local.env[terraform.workspace].region
  alias  = "assume-admin-role"
  assume_role {
    role_arn = "arn:aws:iam::495344428215:role/SymphonyAdminRole"
  }
}

provider "aws" {
  region = "us-east-1"
  alias  = "us-east-1"
}

provider "aws" {
  region = "eu-west-1"
  alias  = "eu-west-1"
}

provider "kubernetes" {
  host                   = data.aws_eks_cluster.current.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.current.certificate_authority.0.data)
  token                  = local.eks_cluster_token
  load_config_file       = false
}

provider "helm" {
  kubernetes {
    host                   = data.aws_eks_cluster.current.endpoint
    cluster_ca_certificate = base64decode(data.aws_eks_cluster.current.certificate_authority.0.data)
    token                  = local.eks_cluster_token
    load_config_file       = false
  }
}
