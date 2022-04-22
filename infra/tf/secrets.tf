module "artifactory_secret" {
  source   = "./modules/secret"
  path     = "${path.module}/secrets/artifactory.yaml"
  override = var.artifactory
}

module "front_secret" {
  source   = "./modules/secret"
  path     = "${path.module}/secrets/front.yaml"
  override = var.front_secret
}
