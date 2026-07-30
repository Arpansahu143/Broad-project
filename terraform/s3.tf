# =============================================================================
# University MIS - S3 Storage
# Encrypted, versioned, private bucket for documents/media (transcripts,
# certificates, uploads), plus a separate bucket for Terraform state backups
# and ALB access logs.
# =============================================================================

resource "aws_s3_bucket" "app_storage" {
  bucket = "${var.s3_bucket_name}-${var.environment}"

  tags = merge(var.common_tags, { Name = "${var.project_name}-app-storage" })
}

resource "aws_s3_bucket_versioning" "app_storage" {
  bucket = aws_s3_bucket.app_storage.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "app_storage" {
  bucket = aws_s3_bucket.app_storage.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.s3.arn
    }
    bucket_key_enabled = true
  }
}

resource "aws_kms_key" "s3" {
  description             = "KMS key for encrypting the University MIS S3 storage bucket"
  deletion_window_in_days = 30
  enable_key_rotation     = true
  tags                    = var.common_tags
}

# Block ALL public access — access is only via the application through IAM
resource "aws_s3_bucket_public_access_block" "app_storage" {
  bucket = aws_s3_bucket.app_storage.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "app_storage" {
  bucket = aws_s3_bucket.app_storage.id

  rule {
    id     = "transition-old-versions"
    status = "Enabled"

    noncurrent_version_transition {
      noncurrent_days = 30
      storage_class   = "STANDARD_IA"
    }

    noncurrent_version_expiration {
      noncurrent_days = 365
    }
  }

  rule {
    id     = "abort-incomplete-multipart-uploads"
    status = "Enabled"

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}

resource "aws_s3_bucket_cors_configuration" "app_storage" {
  bucket = aws_s3_bucket.app_storage.id

  cors_rule {
    allowed_methods = ["GET", "PUT", "POST"]
    allowed_origins = ["https://mis.university.edu"]
    allowed_headers = ["*"]
    max_age_seconds  = 3000
  }
}

# Enforce TLS-only, encrypted-upload access via bucket policy
resource "aws_s3_bucket_policy" "app_storage" {
  bucket = aws_s3_bucket.app_storage.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "DenyInsecureTransport"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:*"
        Resource = [
          aws_s3_bucket.app_storage.arn,
          "${aws_s3_bucket.app_storage.arn}/*"
        ]
        Condition = {
          Bool = { "aws:SecureTransport" = "false" }
        }
      }
    ]
  })
}

# ---------------------------------------------------------------------------
# ALB access logs bucket
# ---------------------------------------------------------------------------
resource "aws_s3_bucket" "alb_logs" {
  bucket = "${var.project_name}-alb-logs-${var.environment}"
  tags   = merge(var.common_tags, { Name = "${var.project_name}-alb-logs" })
}

resource "aws_s3_bucket_lifecycle_configuration" "alb_logs" {
  bucket = aws_s3_bucket.alb_logs.id
  rule {
    id     = "expire-old-logs"
    status = "Enabled"
    expiration {
      days = 90
    }
  }
}

resource "aws_s3_bucket_public_access_block" "alb_logs" {
  bucket                  = aws_s3_bucket.alb_logs.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
