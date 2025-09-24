# Data sources - Commented out due to permissions issue
# data "aws_availability_zones" "available" {
#   state = "available"
# }

# Hardcoded availability zones for us-east-1
locals {
  availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c", "us-east-1d", "us-east-1e", "us-east-1f"]
}

# Random ID for bucket naming
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# VPC Module
module "vpc" {
  source = "./modules/vpc"

  project_name       = var.project_name
  vpc_cidr           = var.vpc_cidr
  public_subnets     = var.public_subnets
  availability_zones = local.availability_zones
}

# S3 Module
module "s3" {
  source = "./modules/s3"

  project_name = var.project_name
  bucket_name  = var.dataset_bucket_name != "" ? var.dataset_bucket_name : "${var.project_name}-dataset-${random_id.bucket_suffix.hex}"
}

# Security Groups Module
module "security" {
  source = "./modules/security"

  project_name       = var.project_name
  vpc_id             = module.vpc.vpc_id
  allowed_ssh_cidr   = var.allowed_ssh_cidr
  alb_security_group = null
}

# EC2 Module
module "ec2" {
  source = "./modules/ec2"

  project_name         = var.project_name
  instance_type        = var.instance_type
  subnet_id            = module.vpc.public_subnet_ids[0]
  security_group_ids   = [module.security.ec2_security_group_id]
  iam_instance_profile = module.s3.iam_instance_profile_name
  dataset_bucket_name  = module.s3.bucket_name
  dataset_s3_key       = "data/cyber_attacks_masked.csv"

  depends_on = [module.s3]
}

# ALB Module
module "alb" {
  source = "./modules/alb"

  project_name         = var.project_name
  vpc_id               = module.vpc.vpc_id
  subnet_ids           = module.vpc.public_subnet_ids
  security_group_ids   = [module.security.alb_security_group_id]
  target_instance_id   = module.ec2.instance_id
  enable_acm           = var.enable_acm
  certificate_arn      = var.enable_acm ? module.acm[0].certificate_arn : null
  alb_logs_bucket_name = module.s3.alb_logs_bucket_name

  depends_on = [module.ec2, module.s3]
}

# WAF Module (Optional - comment out if WAF is not available in your region)
# module "waf" {
#   source = "./modules/waf"

#   project_name = var.project_name
#   alb_arn      = module.alb.alb_arn
#   ip_deny_list = var.waf_ip_deny_list
#   rate_limit   = var.waf_rate_limit
# }

# CloudWatch Module
module "cloudwatch" {
  source = "./modules/cloudwatch"

  project_name        = var.project_name
  instance_id         = module.ec2.instance_id
  alarm_cpu_threshold = var.alarm_cpu_threshold
  enable_sns          = var.enable_sns
  sns_topic_arn       = var.enable_sns ? module.sns[0].topic_arn : null
}

# ACM Module (Optional)
module "acm" {
  count = var.enable_acm ? 1 : 0

  source = "./modules/acm"

  project_name   = var.project_name
  domain_name    = var.domain_name
  hosted_zone_id = var.hosted_zone_id
}

# SNS Module (Optional)
module "sns" {
  count = var.enable_sns ? 1 : 0

  source = "./modules/sns"

  project_name       = var.project_name
  notification_email = var.notification_email
}
