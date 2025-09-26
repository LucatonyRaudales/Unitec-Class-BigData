#!/bin/bash

# Destroy Examen Infrastructure Script
# This script destroys the examen infrastructure

set -e

echo "🗑️  Starting Examen Infrastructure Destruction..."

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo "❌ Terraform is not installed. Please install it first."
    exit 1
fi

# Check if terraform.tfstate exists
if [ ! -f "terraform.tfstate" ]; then
    echo "❌ No terraform.tfstate found. Nothing to destroy."
    exit 1
fi

# Ask for confirmation
echo ""
echo "⚠️  This will DESTROY the following EXAMEN resources:"
echo "   - VPC and subnets (10.1.0.0/16)"
echo "   - S3 bucket and all its contents"
echo "   - 2 EC2 instances"
echo "   - Application Load Balancer"
echo "   - Security Groups"
echo "   - CloudWatch logs and alarms"
echo ""
echo "🚨 THIS ACTION CANNOT BE UNDONE! 🚨"
echo ""
echo "💡 This will NOT affect your main infrastructure (10.0.0.0/16)"
echo ""
read -p "Are you sure you want to destroy the EXAMEN infrastructure? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Destruction cancelled"
    exit 1
fi

# Destroy the infrastructure
echo "🗑️  Destroying examen infrastructure..."
terraform destroy -var-file="terraform.tfvars" -auto-approve

echo ""
echo "✅ Examen infrastructure destroyed successfully!"
echo ""
echo "🧹 Cleanup completed. All examen resources have been removed."
echo "💡 Your main infrastructure (10.0.0.0/16) remains untouched."

