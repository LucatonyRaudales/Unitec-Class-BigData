variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
}

variable "subnet_id" {
  description = "ID of the subnet"
  type        = string
}

variable "security_group_ids" {
  description = "List of security group IDs"
  type        = list(string)
}

variable "iam_instance_profile" {
  description = "Name of the IAM instance profile"
  type        = string
}

variable "dataset_bucket_name" {
  description = "Name of the S3 bucket containing the dataset"
  type        = string
}

variable "dataset_s3_key" {
  description = "S3 key for the dataset file"
  type        = string
}
