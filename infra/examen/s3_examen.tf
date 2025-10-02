# S3 Bucket for Examen Dataset - Create new bucket
resource "aws_s3_bucket" "examen_dataset" {
  bucket = var.dataset_bucket_name != "" ? var.dataset_bucket_name : "${var.project_name}-dataset-${random_id.bucket_suffix.hex}"

  tags = {
    Name        = "${var.project_name}-dataset-bucket"
    Purpose     = "AWS-Examen"
    Environment = "examen"
  }
}

# S3 Bucket Versioning
resource "aws_s3_bucket_versioning" "examen_dataset" {
  bucket = aws_s3_bucket.examen_dataset.id
  versioning_configuration {
    status = "Enabled"
  }
}

# S3 Bucket Server Side Encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "examen_dataset" {
  bucket = aws_s3_bucket.examen_dataset.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# S3 Bucket Public Access Block
resource "aws_s3_bucket_public_access_block" "examen_dataset" {
  bucket = aws_s3_bucket.examen_dataset.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 Bucket for ALB Access Logs
resource "aws_s3_bucket" "examen_alb_logs" {
  bucket = "${aws_s3_bucket.examen_dataset.bucket}-alb-logs"

  tags = {
    Name        = "${var.project_name}-alb-logs-bucket"
    Purpose     = "AWS-Examen"
    Environment = "examen"
  }
}

# S3 Bucket Public Access Block for ALB Logs
resource "aws_s3_bucket_public_access_block" "examen_alb_logs" {
  bucket = aws_s3_bucket.examen_alb_logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 Bucket Policy for ALB Access Logs
resource "aws_s3_bucket_policy" "examen_alb_logs" {
  bucket = aws_s3_bucket.examen_alb_logs.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "delivery.logs.amazonaws.com"
        }
        Action   = "s3:PutObject"
        Resource = "${aws_s3_bucket.examen_alb_logs.arn}/AWSLogs/*"
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
        Resource = aws_s3_bucket.examen_alb_logs.arn
      }
    ]
  })
}

# IAM Role for EC2 to access S3
resource "aws_iam_role" "examen_ec2_s3_access" {
  name = "${var.project_name}-examen-ec2-s3-role"

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
    Name        = "${var.project_name}-ec2-s3-role"
    Purpose     = "AWS-Examen"
    Environment = "examen"
  }
}

# IAM Policy for S3 access
resource "aws_iam_role_policy" "examen_ec2_s3_access" {
  name = "${var.project_name}-examen-ec2-s3-policy"
  role = aws_iam_role.examen_ec2_s3_access.id

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
          aws_s3_bucket.examen_dataset.arn,
          "${aws_s3_bucket.examen_dataset.arn}/*"
        ]
      }
    ]
  })
}

# IAM Instance Profile
resource "aws_iam_instance_profile" "examen_ec2_s3_access" {
  name = "${var.project_name}-examen-ec2-s3-profile"
  role = aws_iam_role.examen_ec2_s3_access.name

  tags = {
    Name        = "${var.project_name}-ec2-s3-profile"
    Purpose     = "AWS-Examen"
    Environment = "examen"
  }
}

# Upload dataset to S3 bucket
resource "aws_s3_object" "examen_dataset" {
  bucket = aws_s3_bucket.examen_dataset.bucket
  key    = "data/dataset_limpio.csv"
  source = "dataset_limpio.csv"

  tags = {
    Name        = "${var.project_name}-dataset-file"
    Purpose     = "AWS-Examen"
    Environment = "examen"
  }
}


