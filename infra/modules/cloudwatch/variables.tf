variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "instance_id" {
  description = "ID of the EC2 instance"
  type        = string
}

variable "alarm_cpu_threshold" {
  description = "CPU utilization threshold for alarm"
  type        = number
}

variable "enable_sns" {
  description = "Enable SNS notifications"
  type        = bool
  default     = false
}

variable "sns_topic_arn" {
  description = "ARN of the SNS topic"
  type        = string
  default     = null
}
