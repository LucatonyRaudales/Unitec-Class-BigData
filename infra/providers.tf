provider "aws" {
  region = var.region

  default_tags {
    tags = {
      Project     = var.project_name
      Owner       = "cyber-eda-student"
      Environment = "academic"
      ManagedBy   = "Terraform"
    }
  }
}
