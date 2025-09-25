# Availability zones for us-east-1
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


# EC2 NextJS Module
module "ec2_nextjs" {
  source = "./modules/ec2-nextjs"

  project_name         = var.project_name
  instance_type        = "t3.micro"
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
  target_instance_id   = module.ec2_nextjs.instance_id
  enable_acm           = var.enable_acm
  certificate_arn      = var.enable_acm ? module.acm[0].certificate_arn : null
  alb_logs_bucket_name = module.s3.alb_logs_bucket_name

  depends_on = [module.ec2_nextjs, module.s3]
}


# CloudWatch Module
module "cloudwatch" {
  source = "./modules/cloudwatch"

  project_name        = var.project_name
  instance_id         = module.ec2_nextjs.instance_id
  alarm_cpu_threshold = var.alarm_cpu_threshold
  enable_sns          = var.enable_sns
  sns_topic_arn       = var.enable_sns ? module.sns[0].topic_arn : null
}

# ACM Module
module "acm" {
  count = var.enable_acm ? 1 : 0

  source = "./modules/acm"

  project_name   = var.project_name
  domain_name    = var.domain_name
  hosted_zone_id = var.hosted_zone_id
}

# SNS Module
module "sns" {
  count = var.enable_sns ? 1 : 0

  source = "./modules/sns"

  project_name       = var.project_name
  notification_email = var.notification_email
}
