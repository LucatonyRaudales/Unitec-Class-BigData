# Example configuration for Examen Infrastructure
# Copy this file to terraform.tfvars and modify as needed

# Examen Configuration
project_name = "cyber-eda-examen"
region       = "us-east-1"

# VPC Configuration (different from main infrastructure)
vpc_cidr       = "10.1.0.0/16"
public_subnets = ["10.1.1.0/24", "10.1.2.0/24"]

# Security Configuration
# IMPORTANT: Set your IP address for SSH access
# You can find your IP at: https://whatismyipaddress.com/
# Example: allowed_ssh_cidr = "203.0.113.0/32"
allowed_ssh_cidr = ""

# Instance Configuration
instance_type = "t3.micro"  # Free tier eligible

# S3 Configuration
# Leave empty to generate a random bucket name
# Or specify a unique name: dataset_bucket_name = "my-examen-bucket-name"
dataset_bucket_name = ""

# CloudWatch Configuration
alarm_cpu_threshold = 70  # CPU percentage threshold for alarms

# SNS Configuration (Optional)
# Set to true if you want email notifications
enable_sns = false
# notification_email = "your-email@example.com"

# Additional Configuration Examples
# Uncomment and modify as needed

# # Custom instance type (not free tier)
# instance_type = "t3.small"

# # Custom VPC CIDR (make sure it doesn't conflict with main infrastructure)
# vpc_cidr = "172.16.0.0/16"

# # Custom subnets
# public_subnets = ["172.16.1.0/24", "172.16.2.0/24"]

# # Enable SNS notifications
# enable_sns = true
# notification_email = "admin@example.com"

# # Custom CPU threshold
# alarm_cpu_threshold = 80

