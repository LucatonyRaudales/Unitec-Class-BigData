# Deployment Instructions

## Quick Start Guide

### Prerequisites

1. **AWS CLI configured:**
   ```bash
   aws configure
   # Enter your Access Key ID, Secret Access Key, Region (us-east-1), and output format (json)
   ```

2. **Terraform installed:**
   ```bash
   # macOS
   brew install terraform
   
   # Linux
   wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
   unzip terraform_1.6.0_linux_amd64.zip
   sudo mv terraform /usr/local/bin/
   ```

3. **Git installed:**
   ```bash
   # Clone the repository
   git clone <repository-url>
   cd infra
   ```

### Step-by-Step Deployment

#### 1. Configure Variables

```bash
# Copy the example file
cp terraform.tfvars.example terraform.tfvars

# Edit with your values
nano terraform.tfvars
```

**Minimum required configuration:**
```hcl
project_name = "cyber-eda-aws"
region       = "us-east-1"
```

**Optional configuration:**
```hcl
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

#### 2. Initialize Terraform

```bash
terraform init
```

#### 3. Plan Deployment

```bash
terraform plan
```

Review the plan to ensure all resources will be created as expected.

#### 4. Deploy Infrastructure

```bash
terraform apply
```

Type `yes` when prompted to confirm the deployment.

#### 5. Upload Dataset

```bash
# Get the bucket name from Terraform output
BUCKET_NAME=$(terraform output -raw dataset_bucket_name)

# Upload your masked dataset
aws s3 cp ./data/sample_dataset.csv s3://$BUCKET_NAME/data/cyber_attacks_masked.csv

# Or upload your own dataset
aws s3 cp ./path/to/your/cyber_attacks_masked.csv s3://$BUCKET_NAME/data/cyber_attacks_masked.csv
```

#### 6. Access Application

```bash
# Get the ALB DNS name
ALB_DNS=$(terraform output -raw alb_dns_name)

echo "Application URL: http://$ALB_DNS"
```

Open the URL in your browser to access the cybersecurity dashboard.

## Advanced Configuration

### Enable HTTPS

1. **Set up Route53 hosted zone:**
   ```bash
   # Create hosted zone
   aws route53 create-hosted-zone --name example.com --caller-reference $(date +%s)
   ```

2. **Update terraform.tfvars:**
   ```hcl
   enable_acm     = true
   domain_name    = "cyber-dashboard.example.com"
   hosted_zone_id = "Z1234567890ABC"  # From Route53 console
   ```

3. **Apply changes:**
   ```bash
   terraform apply
   ```

4. **Update DNS:**
   ```bash
   # Get the ALB DNS name
   ALB_DNS=$(terraform output -raw alb_dns_name)
   
   # Create CNAME record in Route53
   aws route53 change-resource-record-sets --hosted-zone-id Z1234567890ABC --change-batch '{
     "Changes": [{
       "Action": "CREATE",
       "ResourceRecordSet": {
         "Name": "cyber-dashboard.example.com",
         "Type": "CNAME",
         "TTL": 300,
         "ResourceRecords": [{"Value": "'$ALB_DNS'"}]
       }
     }]
   }'
   ```

### Enable SNS Notifications

1. **Update terraform.tfvars:**
   ```hcl
   enable_sns          = true
   notification_email  = "admin@example.com"
   ```

2. **Apply changes:**
   ```bash
   terraform apply
   ```

3. **Confirm email subscription:**
   - Check your email for SNS confirmation
   - Click the confirmation link

### Custom WAF Rules

1. **Update terraform.tfvars:**
   ```hcl
   waf_ip_deny_list = ["192.0.2.0/24", "203.0.113.0/24"]
   waf_rate_limit   = 1000  # requests per 5 minutes
   ```

2. **Apply changes:**
   ```bash
   terraform apply
   ```

## Monitoring and Troubleshooting

### Check Application Status

```bash
# Check EC2 instance status
aws ec2 describe-instances --instance-ids $(terraform output -raw ec2_instance_id)

# Check ALB health
aws elbv2 describe-target-health --target-group-arn $(terraform output -raw target_group_arn)

# Check application logs
aws logs describe-log-streams --log-group-name $(terraform output -raw cloudwatch_log_group_name)
```

### Common Issues

#### 1. Application not accessible

**Check ALB health:**
```bash
aws elbv2 describe-target-health --target-group-arn $(terraform output -raw target_group_arn)
```

**Check security groups:**
```bash
aws ec2 describe-security-groups --group-ids $(terraform output -raw security_group_web_id)
```

#### 2. Dataset not loading

**Check S3 permissions:**
```bash
aws s3 ls s3://$(terraform output -raw dataset_bucket_name)/
```

**Check IAM role:**
```bash
aws iam get-role --role-name $(terraform output -raw iam_role_ec2_name)
```

#### 3. WAF blocking requests

**Check WAF logs:**
```bash
aws logs describe-log-groups --log-group-name-prefix "aws-waf-logs"
```

**Review WAF rules:**
```bash
aws wafv2 get-web-acl --scope REGIONAL --id $(terraform output -raw waf_web_acl_id)
```

### Monitoring Commands

```bash
# Check CPU utilization
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=$(terraform output -raw ec2_instance_id) \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average

# Check application logs
aws logs tail $(terraform output -raw cloudwatch_log_group_name) --follow
```

## Cost Monitoring

### Check Free Tier Usage

```bash
# Check EC2 usage
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=DIMENSION,Key=SERVICE

# Check S3 usage
aws s3api list-objects-v2 --bucket $(terraform output -raw dataset_bucket_name) --query 'Contents[].Size' --output text | awk '{sum+=$1} END {print "Total size:", sum/1024/1024, "MB"}'
```

### Estimated Costs

**Free Tier (first 12 months):**
- EC2 t2.micro: $0 (750 hours/month)
- S3: $0 (5GB storage)
- CloudWatch: $0 (10 metrics)
- ALB: $0 (750 hours/month)
- WAF: $0 (1M requests/month)

**Optional costs:**
- NAT Gateway: ~$22/month
- CloudFront: ~$0.085/GB
- SNS: Free for email
- ACM: Free

## Cleanup

### Destroy Infrastructure

1. **Empty S3 buckets:**
   ```bash
   # Empty dataset bucket
   aws s3 rm s3://$(terraform output -raw dataset_bucket_name) --recursive
   
   # Empty ALB logs bucket
   aws s3 rm s3://$(terraform output -raw dataset_bucket_name)-alb-logs --recursive
   ```

2. **Destroy Terraform resources:**
   ```bash
   terraform destroy
   ```

3. **Verify cleanup:**
   ```bash
   # Check for remaining resources
   aws ec2 describe-instances --filters "Name=tag:Project,Values=cyber-eda-aws"
   aws s3 ls | grep cyber-eda
   ```

### Manual Cleanup (if needed)

If Terraform destroy fails:

1. **Delete S3 buckets manually:**
   ```bash
   aws s3 rb s3://$(terraform output -raw dataset_bucket_name) --force
   aws s3 rb s3://$(terraform output -raw dataset_bucket_name)-alb-logs --force
   ```

2. **Delete CloudWatch log groups:**
   ```bash
   aws logs delete-log-group --log-group-name $(terraform output -raw cloudwatch_log_group_name)
   ```

3. **Delete WAF Web ACL:**
   ```bash
   aws wafv2 delete-web-acl --scope REGIONAL --id $(terraform output -raw waf_web_acl_id)
   ```

4. **Terminate EC2 instance:**
   ```bash
   aws ec2 terminate-instances --instance-ids $(terraform output -raw ec2_instance_id)
   ```

## Security Best Practices

### 1. Access Control

- Use IAM roles with least privilege
- Enable MFA for AWS console access
- Rotate access keys regularly
- Use temporary credentials when possible

### 2. Network Security

- Keep security groups restrictive
- Use private subnets for sensitive resources
- Enable VPC Flow Logs for monitoring
- Consider using AWS PrivateLink

### 3. Data Protection

- Enable S3 bucket versioning
- Use encryption at rest and in transit
- Implement data masking
- Regular backup testing

### 4. Monitoring

- Set up CloudWatch alarms
- Enable CloudTrail for audit logging
- Monitor costs regularly
- Review security groups periodically

## Support and Troubleshooting

### Getting Help

1. **Check logs:**
   ```bash
   aws logs tail $(terraform output -raw cloudwatch_log_group_name) --follow
   ```

2. **Review Terraform state:**
   ```bash
   terraform show
   ```

3. **Check AWS service health:**
   - AWS Service Health Dashboard
   - AWS Personal Health Dashboard

4. **Common solutions:**
   - Restart EC2 instance
   - Check security group rules
   - Verify IAM permissions
   - Review CloudWatch logs

### Documentation

- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [AWS Security Best Practices](https://aws.amazon.com/security/security-resources/)

## License

This project is part of the Final Project for Universidad Unitec - Seguridad con Grandes Volúmenes de Información.
