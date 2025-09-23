variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "alb_arn" {
  description = "ARN of the Application Load Balancer"
  type        = string
}

variable "ip_deny_list" {
  description = "List of IP addresses to deny"
  type        = list(string)
  default     = []
}

variable "rate_limit" {
  description = "Rate limit for requests per 5 minutes"
  type        = number
  default     = 2000
}
