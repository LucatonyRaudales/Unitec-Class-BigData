variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs"
  type        = list(string)
}

variable "security_group_ids" {
  description = "List of security group IDs"
  type        = list(string)
}


variable "target_instance_id" {
  description = "ID of the target EC2 instance"
  type        = string
}

variable "enable_acm" {
  description = "Enable ACM certificate for HTTPS"
  type        = bool
  default     = false
}

variable "certificate_arn" {
  description = "ARN of the ACM certificate"
  type        = string
  default     = null
}

variable "alb_logs_bucket_name" {
  description = "Name of the S3 bucket for ALB logs"
  type        = string
}
