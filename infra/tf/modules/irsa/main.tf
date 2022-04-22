data "aws_arn" "oidc_provider_arn" {
  arn = var.oidc_provider_arn
}

data "aws_iam_policy_document" "assume_role_with_oidc" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [data.aws_arn.oidc_provider_arn.arn]
    }
    condition {
      test     = "StringEquals"
      values   = ["system:serviceaccount:${var.service_account_namespace}:${var.service_account_name}"]
      variable = "${trimprefix(data.aws_arn.oidc_provider_arn.resource, "oidc-provider/")}:sub"
    }
  }
}

resource "aws_iam_role" "this_role" {
  name                 = var.role_name
  name_prefix          = var.role_name_prefix
  path                 = var.role_path
  max_session_duration = var.role_max_session_duration
  permissions_boundary = var.role_permissions_boundary_arn
  assume_role_policy   = data.aws_iam_policy_document.assume_role_with_oidc.json
  tags                 = var.tags
}

resource "aws_iam_role_policy" "this_role_policy" {
  count  = var.role_policy != null ? 1 : 0
  policy = var.role_policy
  role   = aws_iam_role.this_role.id
}

resource "aws_iam_role_policy_attachment" "this_role_policy_attachment" {
  count      = try(length(var.role_policy_arns), 0)
  policy_arn = var.role_policy_arns[count.index]
  role       = aws_iam_role.this_role.id
}
