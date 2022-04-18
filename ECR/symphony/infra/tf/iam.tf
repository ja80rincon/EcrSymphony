locals {
  symphony_admin_role = "SymphonyAdminRole"
}

module "team" {
  source     = "./modules/team-iam"
  group_name = "Symphony"
  role_name  = local.symphony_admin_role
  count      = local.production_only_count
}

data "aws_iam_role" "team_role" {
  name  = local.symphony_admin_role
  count = 1 - length(module.team)
}

module "deployer" {
  source    = "./modules/deployer"
  name      = "symphony.deployer"
  providers = { aws = aws.us-east-1 }
  count     = local.production_only_count
}

resource "aws_iam_user_group_membership" "deployer" {
  user   = module.deployer[count.index].name
  groups = [module.team[count.index].group_name]
  count  = local.production_only_count
}
