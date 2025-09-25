output "bucket_name" {
  description = "Name of the S3 bucket"
  value       = data.aws_s3_bucket.dataset.id
}

output "bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = data.aws_s3_bucket.dataset.arn
}

output "alb_logs_bucket_name" {
  description = "Name of the ALB logs S3 bucket"
  value       = aws_s3_bucket.alb_logs.id
}

output "alb_logs_bucket_arn" {
  description = "ARN of the ALB logs S3 bucket"
  value       = aws_s3_bucket.alb_logs.arn
}

output "iam_instance_profile_name" {
  description = "Name of the IAM instance profile"
  value       = aws_iam_instance_profile.ec2_s3_access.name
}
