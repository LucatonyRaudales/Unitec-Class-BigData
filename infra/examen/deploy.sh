#!/bin/bash

# Deploy Examen Infrastructure Script
# This script deploys the examen infrastructure for the AWS Big Data class

set -e

echo "🎯 Starting Examen Infrastructure Deployment..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo "❌ Terraform is not installed. Please install it first."
    exit 1
fi

# Check AWS credentials
echo "🔐 Checking AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS credentials configured"

# Initialize Terraform
echo "🔧 Initializing Terraform..."
terraform init

# Plan the deployment
echo "📋 Planning deployment..."
terraform plan -var-file="terraform.tfvars" -out=tfplan_examen

# Ask for confirmation
echo ""
echo "⚠️  This will create the following resources for the EXAMEN:"
echo "   - VPC with public subnets (10.1.0.0/16)"
echo "   - S3 bucket for dataset storage"
echo "   - 2 EC2 instances with Apache web server"
echo "   - Application Load Balancer"
echo "   - Security Groups with HTTP/HTTPS and SSH access"
echo "   - CloudWatch monitoring and logging"
echo ""
echo "💰 Estimated cost: ~$17/month (ALB + CloudWatch)"
echo ""
read -p "Do you want to proceed with the examen deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

# Apply the deployment
echo "🚀 Deploying examen infrastructure..."
terraform apply tfplan_examen

# Get outputs
echo ""
echo "✅ Examen deployment completed successfully!"
echo ""
echo "🎯 EXAMEN AWS - Infraestructura Desplegada!"
echo "=========================================="
terraform output -json | jq -r '.examen_instructions.value'

echo ""
echo "🔗 Quick Access Links:"
echo "====================="
echo "Load Balancer URL: $(terraform output -raw examen_alb_dns_name)"
echo "Instance 1 URL: $(terraform output -raw examen_ec2_instance_1_public_ip)"
echo "Instance 2 URL: $(terraform output -raw examen_ec2_instance_2_public_ip)"
echo ""
echo "📊 Dataset URLs:"
echo "==============="
echo "Via Load Balancer: http://$(terraform output -raw examen_alb_dns_name)/dataset_limpio.csv"
echo "Direct from Instance 1: http://$(terraform output -raw examen_ec2_instance_1_public_ip)/dataset_limpio.csv"
echo "Direct from Instance 2: http://$(terraform output -raw examen_ec2_instance_2_public_ip)/dataset_limpio.csv"
echo ""
echo "📈 CloudWatch Dashboard:"
echo "======================="
terraform output -raw examen_cloudwatch_dashboard_url

echo ""
echo "🧪 Testing Instructions:"
echo "======================="
echo "1. Open the Load Balancer URL in your browser"
echo "2. Refresh the page multiple times to see load distribution"
echo "3. Download the dataset from the Load Balancer URL"
echo "4. Check the CloudWatch dashboard for metrics"
echo "5. Verify security groups in AWS console"
echo ""
echo "🎉 Examen infrastructure is ready for testing!"
echo ""
echo "📝 Remember to destroy the infrastructure after the examen:"
echo "   ./destroy.sh"

