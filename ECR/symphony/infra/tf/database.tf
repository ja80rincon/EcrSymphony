locals {
  db_user    = "admin"
  mysql_port = 3306
}

resource "random_pet" "front_db" {}

resource "random_password" "front_db" {
  length  = 16
  special = false
}

module "front_db" {
  source  = "terraform-aws-modules/rds/aws"
  version = "~> 2.0"

  family                     = "mysql5.7"
  major_engine_version       = "5.7"
  engine                     = "mysql"
  engine_version             = "5.7"
  auto_minor_version_upgrade = true
  instance_class             = "db.t2.small"
  allocated_storage          = 16

  identifier = random_pet.front_db.id
  username   = local.db_user
  password   = random_password.front_db.result
  port       = local.mysql_port

  maintenance_window      = "Mon:00:00-Mon:03:00"
  backup_window           = "03:00-06:00"
  backup_retention_period = 7
  deletion_protection     = true
  skip_final_snapshot     = false

  monitoring_role_arn = data.aws_iam_role.rds_monitoring.arn
  monitoring_interval = 60

  vpc_security_group_ids = [data.terraform_remote_state.core.outputs.database.security_group_ids.mysql]
  subnet_ids             = data.terraform_remote_state.core.outputs.database.subnets
  db_subnet_group_name   = data.terraform_remote_state.core.outputs.database.subnet_group

  tags = local.tags
}

resource "random_pet" "graph_db" {}

resource "random_password" "graph_db" {
  length  = 16
  special = false
}

module "graph_db" {
  source  = "terraform-aws-modules/rds/aws"
  version = "~> 2.0"

  family                      = "mysql8.0"
  major_engine_version        = "8.0"
  engine                      = "mysql"
  engine_version              = "8.0.16"
  allow_major_version_upgrade = true
  auto_minor_version_upgrade  = true
  instance_class              = "db.r5.4xlarge"
  multi_az                    = true
  allocated_storage           = 100

  identifier = random_pet.graph_db.id
  username   = local.db_user
  password   = random_password.graph_db.result
  port       = local.mysql_port

  snapshot_identifier          = "graph-snapshot-base"
  maintenance_window           = "Mon:00:00-Mon:03:00"
  backup_window                = "03:00-06:00"
  backup_retention_period      = 35
  deletion_protection          = true
  skip_final_snapshot          = false
  final_snapshot_identifier    = "graph-snapshot-final"
  performance_insights_enabled = true

  monitoring_role_arn = data.aws_iam_role.rds_monitoring.arn
  monitoring_interval = 60

  vpc_security_group_ids = [data.terraform_remote_state.core.outputs.database.security_group_ids.mysql]
  subnet_ids             = data.terraform_remote_state.core.outputs.database.subnets
  db_subnet_group_name   = data.terraform_remote_state.core.outputs.database.subnet_group

  parameters = [
    {
      name  = "max_connect_errors"
      value = 10000
    },
    {
      name  = "max_execution_time",
      value = 10000
    },
    {
      name  = "innodb_file_per_table",
      value = 0
    },
  ]

  tags = local.tags
}

data "aws_iam_role" "rds_monitoring" {
  name = "rds-monitoring-role"
}
