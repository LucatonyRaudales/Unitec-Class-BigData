# Backend configuration - Local by default
# Uncomment and configure for remote state management

# terraform {
#   backend "s3" {
#     bucket         = "your-terraform-state-bucket"
#     key            = "cyber-eda/terraform.tfstate"
#     region         = "us-east-1"
#     encrypt        = true
#     dynamodb_table = "terraform-state-lock"
#   }
# }

# To migrate to remote backend:
# 1. Create S3 bucket and DynamoDB table
# 2. Uncomment the above configuration
# 3. Run: terraform init -migrate-state
