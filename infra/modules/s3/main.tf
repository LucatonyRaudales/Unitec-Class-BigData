# S3 Bucket for Dataset
resource "aws_s3_bucket" "dataset" {
  bucket = var.bucket_name

  tags = {
    Name = "${var.project_name}-dataset-bucket"
  }
}

# S3 Bucket Versioning
resource "aws_s3_bucket_versioning" "dataset" {
  bucket = aws_s3_bucket.dataset.id
  versioning_configuration {
    status = "Enabled"
  }
}

# S3 Bucket Server Side Encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "dataset" {
  bucket = aws_s3_bucket.dataset.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# S3 Bucket Public Access Block
resource "aws_s3_bucket_public_access_block" "dataset" {
  bucket = aws_s3_bucket.dataset.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 Bucket for ALB Access Logs
resource "aws_s3_bucket" "alb_logs" {
  bucket = "${var.bucket_name}-alb-logs"

  tags = {
    Name = "${var.project_name}-alb-logs-bucket"
  }
}

# S3 Bucket Public Access Block for ALB Logs
resource "aws_s3_bucket_public_access_block" "alb_logs" {
  bucket = aws_s3_bucket.alb_logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 Bucket Policy for ALB Access Logs
resource "aws_s3_bucket_policy" "alb_logs" {
  bucket = aws_s3_bucket.alb_logs.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::127311923021:root" # ALB service account
        }
        Action   = "s3:PutObject"
        Resource = "${aws_s3_bucket.alb_logs.arn}/AWSLogs/*"
      },
      {
        Effect = "Allow"
        Principal = {
          Service = "delivery.logs.amazonaws.com"
        }
        Action   = "s3:PutObject"
        Resource = "${aws_s3_bucket.alb_logs.arn}/AWSLogs/*"
        Condition = {
          StringEquals = {
            "s3:x-amz-acl" = "bucket-owner-full-control"
          }
        }
      },
      {
        Effect = "Allow"
        Principal = {
          Service = "delivery.logs.amazonaws.com"
        }
        Action   = "s3:GetBucketAcl"
        Resource = aws_s3_bucket.alb_logs.arn
      }
    ]
  })
}

# IAM Role for EC2 to access S3
resource "aws_iam_role" "ec2_s3_access" {
  name = "${var.project_name}-ec2-s3-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-ec2-s3-role"
  }
}

# IAM Policy for S3 access
resource "aws_iam_role_policy" "ec2_s3_access" {
  name = "${var.project_name}-ec2-s3-policy"
  role = aws_iam_role.ec2_s3_access.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.dataset.arn,
          "${aws_s3_bucket.dataset.arn}/*"
        ]
      }
    ]
  })
}

# IAM Instance Profile
resource "aws_iam_instance_profile" "ec2_s3_access" {
  name = "${var.project_name}-ec2-s3-profile"
  role = aws_iam_role.ec2_s3_access.name

  tags = {
    Name = "${var.project_name}-ec2-s3-profile"
  }
}
