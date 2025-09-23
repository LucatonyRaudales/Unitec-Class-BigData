variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC"
  type        = string
}

variable "allowed_ssh_cidr" {
  description = "CIDR block allowed to SSH to EC2 instances"
  type        = string
}

variable "alb_security_group" {
  description = "Security group ID for ALB"
  type        = string
}
