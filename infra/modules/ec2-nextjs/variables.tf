variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "cyber-eda-aws"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.medium"
}

variable "subnet_id" {
  description = "Subnet ID for the EC2 instance"
  type        = string
}

variable "security_group_ids" {
  description = "Security group IDs for the EC2 instance"
  type        = list(string)
}

variable "iam_instance_profile" {
  description = "IAM instance profile name"
  type        = string
}

variable "dataset_bucket_name" {
  description = "S3 bucket name for the dataset"
  type        = string
}

variable "dataset_s3_key" {
  description = "S3 key for the dataset"
  type        = string
}
