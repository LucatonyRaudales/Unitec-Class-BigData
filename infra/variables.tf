# Project Configuration
variable "project_name" {
  description = "Name of the project for resource tagging"
  type        = string
  default     = "cyber-eda-aws"
}

variable "region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

# VPC Configuration
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnets" {
  description = "List of public subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

# Security Configuration
variable "allowed_ssh_cidr" {
  description = "CIDR block allowed to SSH to EC2 instances. Leave empty to disable SSH access"
  type        = string
  default     = ""
}

# Instance Configuration
variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

# S3 Configuration
variable "dataset_bucket_name" {
  description = "Name for the S3 bucket containing the dataset. If empty, a random name will be generated"
  type        = string
  default     = ""
}

# ACM Configuration (Optional)
variable "enable_acm" {
  description = "Enable ACM certificate for HTTPS"
  type        = bool
  default     = false
}

variable "domain_name" {
  description = "Domain name for ACM certificate (required if enable_acm is true)"
  type        = string
  default     = ""
}

variable "hosted_zone_id" {
  description = "Route53 hosted zone ID for domain validation (required if enable_acm is true)"
  type        = string
  default     = ""
}

# SNS Configuration (Optional)
variable "enable_sns" {
  description = "Enable SNS notifications for CloudWatch alarms"
  type        = bool
  default     = false
}

variable "notification_email" {
  description = "Email address for SNS notifications (required if enable_sns is true)"
  type        = string
  default     = ""
}

# CloudWatch Configuration
variable "alarm_cpu_threshold" {
  description = "CPU utilization threshold for CloudWatch alarm (percentage)"
  type        = number
  default     = 70
}

# WAF Configuration
variable "waf_ip_deny_list" {
  description = "List of IP addresses to deny via WAF"
  type        = list(string)
  default     = []
}

variable "waf_rate_limit" {
  description = "Rate limit for WAF (requests per 5 minutes)"
  type        = number
  default     = 2000
}
