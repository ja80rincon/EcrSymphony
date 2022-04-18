resource "aws_iam_user" "deployer" {
  name = var.name
  path = var.path
}

data "aws_iam_policy_document" "deployer" {
  statement {
    actions = [
      "dynamodb:PutItem",
      "dynamodb:DeleteItem",
    ]
    resources = [
      data.aws_dynamodb_table.lock.arn,
    ]
  }
  statement {
    actions = [
      "s3:PutObject",
    ]
    resources = [
      "${data.aws_s3_bucket.deployment.arn}/symphony/*",
    ]
  }
  statement {
    actions = [
      "kms:Decrypt",
    ]
    resources = [
      data.aws_arn.sops_ksm_key.arn,
    ]
  }
}

resource "aws_iam_user_policy" "deployer" {
  policy = data.aws_iam_policy_document.deployer.json
  user   = aws_iam_user.deployer.name
}

resource "aws_iam_user_policy_attachment" "deployer_read_only" {
  policy_arn = "arn:aws:iam::aws:policy/ReadOnlyAccess"
  user       = aws_iam_user.deployer.name
}
