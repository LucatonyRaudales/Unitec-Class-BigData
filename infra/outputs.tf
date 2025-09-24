# VPC Outputs
output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = module.vpc.public_subnet_ids
}

# ALB Outputs
output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = module.alb.alb_dns_name
}

output "alb_zone_id" {
  description = "Zone ID of the Application Load Balancer"
  value       = module.alb.alb_zone_id
}

output "alb_arn" {
  description = "ARN of the Application Load Balancer"
  value       = module.alb.alb_arn
}

# EC2 Outputs
output "ec2_instance_id" {
  description = "ID of the EC2 instance"
  value       = module.ec2.instance_id
}

output "ec2_public_ip" {
  description = "Public IP of the EC2 instance"
  value       = module.ec2.public_ip
}

output "ec2_private_ip" {
  description = "Private IP of the EC2 instance"
  value       = module.ec2.private_ip
}

# S3 Outputs
output "dataset_bucket_name" {
  description = "Name of the S3 bucket containing the dataset"
  value       = module.s3.bucket_name
}

output "dataset_bucket_arn" {
  description = "ARN of the S3 bucket containing the dataset"
  value       = module.s3.bucket_arn
}

# WAF Outputs
# output "waf_web_acl_arn" {
#   description = "ARN of the WAF Web ACL"
#   value       = module.waf.web_acl_arn
# }

# CloudWatch Outputs
output "cloudwatch_log_group_name" {
  description = "Name of the CloudWatch log group"
  value       = module.cloudwatch.log_group_name
}

# Application URLs
output "application_url" {
  description = "URL to access the application"
  value       = "http://${module.alb.alb_dns_name}"
}

output "application_url_https" {
  description = "HTTPS URL to access the application (if ACM is enabled)"
  value       = var.enable_acm ? "https://${module.alb.alb_dns_name}" : null
}

# Instructions
output "setup_instructions" {
  description = "Instructions to complete the setup"
  value       = <<-EOT
    1. Upload your masked dataset to S3:
       aws s3 cp ./data/cyber_attacks_masked.csv s3://${module.s3.bucket_name}/data/cyber_attacks_masked.csv
    
    2. Access your application:
       http://${module.alb.alb_dns_name}
    
    3. Monitor your application:
       AWS Console > CloudWatch > Logs > ${module.cloudwatch.log_group_name}
    
    4. To destroy resources:
       terraform destroy
       (Note: Empty S3 bucket first if needed)
  EOT
}
