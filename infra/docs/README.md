# Cybersecurity Dashboard - Infrastructure as Code

## Overview

This repository contains Terraform infrastructure for deploying a cybersecurity dashboard application on AWS. The application displays masked cybersecurity attack data with filtering capabilities, deployed behind an Application Load Balancer with WAF protection and CloudWatch monitoring.

## Architecture

The infrastructure includes:
- **VPC** with public subnets across 2 AZs
- **EC2** instance running Flask application
- **Application Load Balancer** with optional HTTPS
- **WAF** with OWASP rules and rate limiting
- **S3** buckets for dataset and ALB logs
- **CloudWatch** monitoring and alerting
- **ACM** certificate (optional)
- **SNS** notifications (optional)

## Quick Start

### Prerequisites

- Terraform >= 1.6
- AWS CLI configured
- AWS account with appropriate permissions

### Deployment Steps

1. **Clone and navigate to the repository:**
   ```bash
   git clone <repository-url>
   cd infra
   ```

2. **Configure variables:**
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your values
   ```

3. **Initialize Terraform:**
   ```bash
   terraform init
   ```

4. **Plan deployment:**
   ```bash
   terraform plan
   ```

5. **Deploy infrastructure:**
   ```bash
   terraform apply
   ```

6. **Upload your masked dataset:**
   ```bash
   aws s3 cp ./data/cyber_attacks_masked.csv s3://$(terraform output -raw dataset_bucket_name)/data/cyber_attacks_masked.csv
   ```

7. **Access your application:**
   ```bash
   echo "Application URL: http://$(terraform output -raw alb_dns_name)"
   ```

## Configuration

### Required Variables

- `project_name` - Name for resource tagging
- `region` - AWS region (default: us-east-1)

### Optional Variables

- `enable_acm` - Enable HTTPS with ACM certificate (default: false)
- `enable_sns` - Enable SNS notifications (default: false)
- `allowed_ssh_cidr` - CIDR for SSH access (empty = disabled)
- `waf_ip_deny_list` - List of IPs to block via WAF
- `alarm_cpu_threshold` - CPU threshold for alarms (default: 70)

### Example terraform.tfvars

```hcl
project_name = "cyber-eda-aws"
region       = "us-east-1"

# Enable HTTPS (requires domain and hosted zone)
enable_acm     = true
domain_name    = "cyber-dashboard.example.com"
hosted_zone_id = "Z1234567890ABC"

# Enable SNS notifications
enable_sns          = true
notification_email  = "admin@example.com"

# Security
allowed_ssh_cidr = "203.0.113.0/24"  # Your IP
waf_ip_deny_list = ["192.0.2.0/24"]  # IPs to block
```

## Services and Components

### VPC Module
- Creates VPC with public subnets
- Internet Gateway for public access
- Route tables for internet routing

### Security Module
- ALB Security Group (HTTP/HTTPS from internet)
- EC2 Security Group (HTTP from ALB, optional SSH)
- Restrictive rules following least privilege

### S3 Module
- Dataset bucket with SSE-S3 encryption
- ALB logs bucket with proper permissions
- IAM role for EC2 S3 access

### EC2 Module
- Amazon Linux 2023 instance
- User data script for application setup
- IAM instance profile for S3 access

### ALB Module
- Application Load Balancer
- Target group with health checks
- HTTP listener (redirects to HTTPS if ACM enabled)
- Optional HTTPS listener with ACM certificate

### WAF Module
- Web Application Firewall
- OWASP managed rule sets
- Rate limiting (2000 requests/5 minutes)
- Optional IP deny list

### CloudWatch Module
- Log groups for application logs
- CPU utilization alarm
- Status check alarms
- Optional SNS integration

### ACM Module (Optional)
- SSL/TLS certificate
- DNS validation via Route53
- Automatic renewal

### SNS Module (Optional)
- Email notifications for alarms
- Topic for alerting

## Security Features

### Network Security
- VPC isolation
- Security groups with minimal access
- WAF protection against common attacks
- Optional HTTPS encryption

### Data Security
- S3 server-side encryption (SSE-S3)
- Data masking in application
- IAM roles with least privilege
- No public access to S3 buckets

### Monitoring
- CloudWatch metrics and alarms
- Application logs
- Health checks
- Optional SNS notifications

## Monitoring and Logging

### CloudWatch Metrics
- CPU utilization
- Memory usage
- Disk usage
- Network I/O

### CloudWatch Alarms
- CPU > 70% for 5 minutes
- Status check failed
- Instance reachability

### Log Groups
- `/aws/ec2/cyber-eda-aws` - Application logs
- System logs
- Cloud-init logs

## Cost Optimization

### Free Tier Eligible
- EC2 t2.micro (750 hours/month)
- S3 (5GB storage)
- CloudWatch (10 metrics)
- ALB (750 hours/month)
- WAF (1M requests/month)

### Optional Costs
- NAT Gateway (~$22/month)
- CloudFront (~$0.085/GB)
- ACM certificate (free)
- SNS (free for email)

## Troubleshooting

### Common Issues

1. **Application not accessible:**
   - Check ALB health checks
   - Verify security groups
   - Check EC2 instance status

2. **Dataset not loading:**
   - Verify S3 bucket permissions
   - Check IAM role for EC2
   - Confirm dataset file exists

3. **WAF blocking requests:**
   - Check WAF logs in CloudWatch
   - Review rate limiting rules
   - Verify IP deny list

4. **High costs:**
   - Check for non-Free Tier resources
   - Review CloudWatch log retention
   - Monitor S3 storage usage

### Debugging Commands

```bash
# Check EC2 instance status
aws ec2 describe-instances --instance-ids $(terraform output -raw ec2_instance_id)

# Check ALB health
aws elbv2 describe-target-health --target-group-arn $(terraform output -raw target_group_arn)

# Check S3 bucket contents
aws s3 ls s3://$(terraform output -raw dataset_bucket_name)/

# Check CloudWatch logs
aws logs describe-log-streams --log-group-name $(terraform output -raw cloudwatch_log_group_name)
```

## Cleanup

### Destroy Infrastructure

1. **Empty S3 buckets first:**
   ```bash
   aws s3 rm s3://$(terraform output -raw dataset_bucket_name) --recursive
   aws s3 rm s3://$(terraform output -raw dataset_bucket_name)-alb-logs --recursive
   ```

2. **Destroy Terraform resources:**
   ```bash
   terraform destroy
   ```

### Manual Cleanup

If Terraform destroy fails:
1. Delete S3 buckets manually
2. Delete CloudWatch log groups
3. Delete WAF Web ACL
4. Terminate EC2 instance
5. Delete ALB and target groups

## Best Practices

### Security
- Use least privilege IAM policies
- Enable CloudTrail for audit logging
- Regular security group reviews
- Keep AMIs updated

### Monitoring
- Set up appropriate alarms
- Monitor costs regularly
- Review CloudWatch logs
- Test disaster recovery

### Maintenance
- Regular Terraform plan/apply
- Update AMI IDs periodically
- Review and update dependencies
- Document changes

## Support

For issues or questions:
1. Check CloudWatch logs
2. Review Terraform state
3. Consult AWS documentation
4. Contact the development team

## License

This project is part of the Final Project for Universidad Unitec - Seguridad con Grandes Volúmenes de Información.
