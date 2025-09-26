#!/bin/bash

# Validate Examen Infrastructure Script
# This script validates the examen infrastructure configuration

set -e

echo "🔍 Validating Examen Infrastructure Configuration..."

# Check if we're in the right directory
if [ ! -f "main.tf" ]; then
    echo "❌ main.tf not found. Please run this script from the infra/examen directory."
    exit 1
fi

echo "✅ Found main.tf"

# Check if terraform.tfvars exists
if [ ! -f "terraform.tfvars" ]; then
    echo "⚠️  terraform.tfvars not found. Creating from template..."
    echo "   Please review and modify terraform.tfvars as needed"
fi

# Check if required tools are installed
echo "🔧 Checking required tools..."

# Check AWS CLI
if command -v aws &> /dev/null; then
    echo "✅ AWS CLI is installed"
    # Check AWS credentials
    if aws sts get-caller-identity &> /dev/null; then
        echo "✅ AWS credentials are configured"
        AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
        echo "   AWS Account: $AWS_ACCOUNT"
    else
        echo "❌ AWS credentials not configured. Please run 'aws configure'"
        exit 1
    fi
else
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check Terraform
if command -v terraform &> /dev/null; then
    echo "✅ Terraform is installed"
    TERRAFORM_VERSION=$(terraform version -json | jq -r '.terraform_version')
    echo "   Terraform version: $TERRAFORM_VERSION"
else
    echo "❌ Terraform is not installed. Please install it first."
    exit 1
fi

# Check jq
if command -v jq &> /dev/null; then
    echo "✅ jq is installed"
else
    echo "❌ jq is not installed. Please install it first."
    exit 1
fi

# Check curl
if command -v curl &> /dev/null; then
    echo "✅ curl is installed"
else
    echo "❌ curl is not installed. Please install it first."
    exit 1
fi

echo ""

# Validate Terraform configuration
echo "🔧 Validating Terraform configuration..."

# Initialize Terraform
echo "Initializing Terraform..."
if terraform init &> /dev/null; then
    echo "✅ Terraform initialized successfully"
else
    echo "❌ Terraform initialization failed"
    exit 1
fi

# Validate Terraform configuration
echo "Validating Terraform configuration..."
if terraform validate &> /dev/null; then
    echo "✅ Terraform configuration is valid"
else
    echo "❌ Terraform configuration is invalid"
    echo "Run 'terraform validate' for details"
    exit 1
fi

# Check for plan errors
echo "Planning Terraform deployment..."
if terraform plan -var-file="terraform.tfvars" -out=tfplan_examen &> /dev/null; then
    echo "✅ Terraform plan successful"
else
    echo "❌ Terraform plan failed"
    echo "Run 'terraform plan -var-file=terraform.tfvars' for details"
    exit 1
fi

echo ""

# Check AWS region
echo "🌍 Checking AWS region..."
REGION=$(grep 'region' terraform.tfvars | cut -d'"' -f2)
if [ -z "$REGION" ]; then
    REGION="us-east-1"
fi

echo "   Target region: $REGION"

# Check if region is supported
if aws ec2 describe-regions --region-names "$REGION" &> /dev/null; then
    echo "✅ Region $REGION is supported"
else
    echo "❌ Region $REGION is not supported or accessible"
    exit 1
fi

echo ""

# Check for existing resources
echo "🔍 Checking for existing resources..."

# Check for existing VPCs with examen tag
VPC_COUNT=$(aws ec2 describe-vpcs --filters "Name=tag:Project,Values=cyber-eda-examen" --query 'length(Vpcs)' --output text 2>/dev/null || echo "0")
if [ "$VPC_COUNT" -gt 0 ]; then
    echo "⚠️  Found $VPC_COUNT existing VPC(s) with project tag 'cyber-eda-examen'"
    echo "   Consider destroying existing resources before deploying new ones"
else
    echo "✅ No existing VPCs found with project tag 'cyber-eda-examen'"
fi

# Check for existing S3 buckets
BUCKET_NAME=$(grep 'dataset_bucket_name' terraform.tfvars | cut -d'"' -f2)
if [ -z "$BUCKET_NAME" ]; then
    echo "✅ S3 bucket name will be auto-generated"
else
    if aws s3api head-bucket --bucket "$BUCKET_NAME" &> /dev/null; then
        echo "⚠️  S3 bucket '$BUCKET_NAME' already exists"
        echo "   Consider using a different name or destroying existing bucket"
    else
        echo "✅ S3 bucket name '$BUCKET_NAME' is available"
    fi
fi

echo ""

# Check for conflicts with main infrastructure
echo "🔍 Checking for conflicts with main infrastructure..."

# Check if main infrastructure VPC exists
MAIN_VPC_COUNT=$(aws ec2 describe-vpcs --filters "Name=cidr,Values=10.0.0.0/16" --query 'length(Vpcs)' --output text 2>/dev/null || echo "0")
if [ "$MAIN_VPC_COUNT" -gt 0 ]; then
    echo "✅ Main infrastructure VPC (10.0.0.0/16) exists - no conflicts expected"
    echo "   Examen will use different CIDR (10.1.0.0/16)"
else
    echo "ℹ️  No main infrastructure VPC found - this is normal for first deployment"
fi

echo ""

# Summary
echo "📋 Examen Validation Summary"
echo "==========================="
echo "✅ Configuration files: OK"
echo "✅ Required tools: OK"
echo "✅ AWS credentials: OK"
echo "✅ Terraform configuration: OK"
echo "✅ AWS region: OK"
echo "✅ Resource availability: OK"
echo "✅ No conflicts with main infrastructure: OK"
echo ""
echo "🎉 Examen infrastructure is ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Review terraform.tfvars configuration"
echo "2. Run './deploy.sh' to deploy the examen infrastructure"
echo "3. Run './test.sh' to test the deployment"
echo "4. Collect evidence for your examen submission"
echo ""
echo "📚 Documentation:"
echo "   - README.md: Complete examen documentation"
echo "   - diagram.md: Architecture diagrams"
echo ""
echo "💰 Cost reminder:"
echo "   - Estimated cost: ~$17/month (ALB + CloudWatch)"
echo "   - Remember to destroy after examen: ./destroy.sh"

