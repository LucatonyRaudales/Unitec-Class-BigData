# Examen AWS - Variables Configuration

# Project Configuration
variable "project_name" {
  description = "Name of the project for resource tagging"
  type        = string
  default     = "cyber-eda-examen"
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
  default     = "10.1.0.0/16"
}

variable "public_subnets" {
  description = "List of public subnet CIDR blocks"
  type        = list(string)
  default     = ["10.1.1.0/24", "10.1.2.0/24"]
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
  default     = "t3.micro"
}

# S3 Configuration
variable "dataset_bucket_name" {
  description = "Name for the S3 bucket containing the dataset. If empty, a random name will be generated"
  type        = string
  default     = ""
}

# CloudWatch Configuration
variable "alarm_cpu_threshold" {
  description = "CPU utilization threshold for CloudWatch alarm (percentage)"
  type        = number
  default     = 70
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

