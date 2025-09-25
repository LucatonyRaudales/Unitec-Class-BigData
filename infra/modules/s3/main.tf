# S3 Bucket for Dataset - Use existing bucket
data "aws_s3_bucket" "dataset" {
  bucket = var.bucket_name
}

# Note: Using existing bucket, skipping versioning, encryption, and public access block configuration
# These should already be configured on the existing bucket

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
          data.aws_s3_bucket.dataset.arn,
          "${data.aws_s3_bucket.dataset.arn}/*"
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
