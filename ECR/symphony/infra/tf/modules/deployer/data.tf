data "aws_dynamodb_table" "lock" {
  name = "symphony.tflock"
}

data "aws_s3_bucket" "deployment" {
  bucket = "symphony.deployment"
}

data "aws_arn" "sops_ksm_key" {
  arn = "arn:aws:kms:eu-central-1:495344428215:key/b2ffcd21-f9c5-4b17-9f0c-288c93ebb8fe"
}
