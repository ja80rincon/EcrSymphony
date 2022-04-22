output "group_name" {
  value = aws_iam_group.this_group.name
}

output "role_arn" {
  value = aws_iam_role.this_role.arn
}
