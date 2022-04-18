resource "aws_iam_group" "this_group" {
  name = var.group_name
}

resource "aws_iam_group_policy" "this_group_policy" {
  group  = aws_iam_group.this_group.id
  policy = data.aws_iam_policy_document.this_group_policy.json
}

data "aws_iam_policy_document" "this_group_policy" {
  statement {
    actions   = ["sts:AssumeRole"]
    resources = [aws_iam_role.this_role.arn]
  }
}

resource "aws_iam_role" "this_role" {
  name               = var.role_name
  assume_role_policy = data.aws_iam_policy_document.assume_this_role.json
}

data "aws_iam_policy_document" "assume_this_role" {
  statement {
    principals {
      identifiers = ["arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"]
      type        = "AWS"
    }

    actions = ["sts:AssumeRole"]
  }
}

data "aws_caller_identity" "current" {}
