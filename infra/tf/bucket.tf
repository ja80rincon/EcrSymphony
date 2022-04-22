resource "aws_s3_bucket" "store" {
  bucket_prefix = "phb-${local.core_workspace}-"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "DELETE"]
    allowed_origins = ["https://*.${local.domain_name}"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3600
  }

  versioning {
    enabled = true
  }

  lifecycle_rule {
    enabled = true

    tags = {
      "autoclean" = "true"
    }

    expiration {
      days = 7
    }
  }

  lifecycle_rule {
    enabled = true

    noncurrent_version_expiration {
      days = 180
    }
  }

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }

  tags = local.tags
}

resource "aws_s3_bucket_public_access_block" "store" {
  bucket                  = aws_s3_bucket.store.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

locals {
  store_bucket_url   = format("s3://%s?region=%s", aws_s3_bucket.store.id, aws_s3_bucket.store.region)
  store_exports_path = "exports/"
}
