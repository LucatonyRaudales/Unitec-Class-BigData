# Architecture Documentation

## System Overview

The Cybersecurity Dashboard infrastructure is designed as a secure, scalable, and cost-effective solution for analyzing masked cybersecurity attack data. The architecture follows AWS Well-Architected Framework principles with emphasis on security, reliability, and cost optimization.

## High-Level Architecture

```
Internet
    ↓
CloudFront CDN (Optional)
    ↓
AWS WAF
    ↓
Application Load Balancer
    ↓
EC2 Instance (Flask App)
    ↓
S3 Bucket (Dataset)
    ↓
CloudWatch (Monitoring)
```

## Component Details

### 1. VPC and Networking

#### VPC Configuration
- **CIDR Block**: 10.0.0.0/16
- **DNS Resolution**: Enabled
- **DNS Hostnames**: Enabled
- **Tenancy**: Default

#### Subnets
- **Public Subnets**: 2 subnets across different AZs
  - 10.0.1.0/24 (us-east-1a)
  - 10.0.2.0/24 (us-east-1b)
- **Map Public IP**: Enabled for public subnets

#### Internet Gateway
- Single IGW for all public subnets
- Routes 0.0.0.0/0 traffic to internet

#### Route Tables
- **Public Route Table**: Routes internet traffic via IGW
- **Associations**: All public subnets associated with public route table

### 2. Security Groups

#### ALB Security Group
```yaml
Inbound Rules:
  - Port 80 (HTTP): 0.0.0.0/0
  - Port 443 (HTTPS): 0.0.0.0/0
Outbound Rules:
  - All traffic: 0.0.0.0/0
```

#### EC2 Security Group
```yaml
Inbound Rules:
  - Port 80 (HTTP): ALB Security Group only
  - Port 22 (SSH): allowed_ssh_cidr (optional)
Outbound Rules:
  - All traffic: 0.0.0.0/0
```

### 3. Application Load Balancer

#### Configuration
- **Type**: Application Load Balancer
- **Scheme**: Internet-facing
- **IP Address Type**: IPv4
- **Subnets**: 2 public subnets across AZs

#### Target Group
- **Protocol**: HTTP
- **Port**: 80
- **Health Check**: HTTP GET /
- **Health Check Interval**: 30 seconds
- **Healthy Threshold**: 2
- **Unhealthy Threshold**: 2
- **Timeout**: 5 seconds

#### Listeners
- **HTTP (Port 80)**: 
  - If ACM enabled: Redirect to HTTPS
  - If ACM disabled: Forward to target group
- **HTTPS (Port 443)**: Forward to target group (ACM only)

#### Access Logs
- **Destination**: S3 bucket
- **Prefix**: alb-logs/
- **Format**: JSON

### 4. EC2 Instance

#### Instance Configuration
- **AMI**: Amazon Linux 2023 (latest)
- **Instance Type**: t2.micro (Free Tier)
- **Storage**: 20GB GP3 encrypted
- **IAM Role**: S3 read access for dataset bucket

#### User Data Script
The user data script performs the following:
1. Updates system packages
2. Installs Python 3, pip, and dependencies
3. Creates virtual environment
4. Installs Flask application dependencies
5. Downloads and configures Flask application
6. Creates systemd service for application
7. Configures CloudWatch agent
8. Starts application service

#### Application Service
- **Service Name**: cyber-dashboard.service
- **User**: root
- **Working Directory**: /opt/app
- **Command**: gunicorn --bind 0.0.0.0:80 --workers 2 app:app
- **Restart**: always
- **Environment Variables**: DATASET_S3_BUCKET, DATASET_S3_KEY

### 5. S3 Storage

#### Dataset Bucket
- **Encryption**: SSE-S3 (AES-256)
- **Versioning**: Enabled
- **Public Access**: Blocked
- **Lifecycle**: None (cost optimization)

#### ALB Logs Bucket
- **Encryption**: SSE-S3 (AES-256)
- **Public Access**: Blocked
- **Bucket Policy**: Allows ALB service to write logs

#### IAM Permissions
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::dataset-bucket",
        "arn:aws:s3:::dataset-bucket/*"
      ]
    }
  ]
}
```

### 6. WAF (Web Application Firewall)

#### Web ACL Configuration
- **Scope**: Regional (ALB)
- **Default Action**: Allow
- **Rules Priority**: 1-7

#### Managed Rule Groups
1. **AWSManagedRulesCommonRuleSet** (Priority 1)
   - SQL injection
   - Cross-site scripting
   - HTTP flood protection
   - Size restrictions

2. **AWSManagedRulesAmazonIpReputationList** (Priority 2)
   - Known malicious IPs
   - Bot traffic detection

3. **AWSManagedRulesSQLiRuleSet** (Priority 3)
   - SQL injection patterns
   - Database attack prevention

4. **AWSManagedRulesKnownBadInputsRuleSet** (Priority 4)
   - Malicious input patterns
   - Command injection

5. **AWSManagedRulesXSSRuleSet** (Priority 5)
   - Cross-site scripting
   - Script injection

6. **Rate Limiting Rule** (Priority 6)
   - 2000 requests per 5 minutes per IP
   - Action: Block

7. **IP Deny List Rule** (Priority 7)
   - Custom IP addresses to block
   - Action: Block

#### CloudWatch Metrics
- All rules have CloudWatch metrics enabled
- Sampled requests enabled for debugging

### 7. CloudWatch Monitoring

#### Log Groups
- **Application Logs**: /aws/ec2/cyber-eda-aws
- **Retention**: 30 days
- **Log Streams**: cloud-init, system

#### Metrics
- **Namespace**: Cybersecurity/App
- **Custom Metrics**: CPU, Memory, Disk usage
- **Collection Interval**: 60 seconds

#### Alarms
1. **CPU High** (Priority: High)
   - Metric: CPUUtilization
   - Threshold: 70%
   - Period: 5 minutes
   - Evaluation Periods: 2

2. **Status Check Failed** (Priority: High)
   - Metric: StatusCheckFailed
   - Threshold: 0
   - Period: 5 minutes
   - Evaluation Periods: 2

3. **Instance Reachability** (Priority: High)
   - Metric: StatusCheckFailed_Instance
   - Threshold: 0
   - Period: 5 minutes
   - Evaluation Periods: 2

### 8. ACM Certificate (Optional)

#### Certificate Configuration
- **Domain**: Custom domain name
- **Validation**: DNS validation
- **Provider**: Route53
- **Auto-renewal**: Enabled

#### Route53 Records
- **Type**: CNAME
- **Name**: _acme-challenge subdomain
- **Value**: ACM validation token
- **TTL**: 60 seconds

### 9. SNS Notifications (Optional)

#### Topic Configuration
- **Name**: cyber-eda-aws-alerts
- **Protocol**: Email
- **Endpoint**: Notification email address

#### Subscription
- **Protocol**: Email
- **Endpoint**: User-provided email
- **Confirmation**: Required (user must confirm)

## Security Architecture

### Defense in Depth

1. **Network Level**
   - VPC isolation
   - Security groups
   - NACLs (if needed)

2. **Application Level**
   - WAF protection
   - Input validation
   - Data masking

3. **Data Level**
   - Encryption at rest
   - Encryption in transit
   - Access controls

4. **Monitoring Level**
   - CloudWatch alarms
   - Log analysis
   - Incident response

### Data Protection

#### Data Masking
- **IP Addresses**: XXX.XXX.XXX.XXX
- **Email Addresses**: ***@***.***
- **Usernames**: USER_****
- **Implementation**: Application-level masking

#### Encryption
- **S3**: SSE-S3 (AES-256)
- **EC2**: EBS encryption
- **Transit**: TLS 1.2+ (if HTTPS enabled)

#### Access Control
- **IAM Roles**: Least privilege
- **S3 Policies**: Bucket-specific access
- **Security Groups**: Port-specific access

## Scalability Considerations

### Horizontal Scaling
- **ALB**: Can handle multiple EC2 instances
- **Target Group**: Auto Scaling Group ready
- **WAF**: Scales automatically with ALB

### Vertical Scaling
- **Instance Type**: Easy to change in Terraform
- **Storage**: EBS volume can be resized
- **Memory**: Instance type determines memory

### Performance Optimization
- **Caching**: Application-level dataset caching
- **CDN**: CloudFront can be added
- **Database**: RDS can be added for persistence

## Cost Optimization

### Free Tier Utilization
- **EC2**: t2.micro (750 hours/month)
- **S3**: 5GB storage
- **CloudWatch**: 10 metrics
- **ALB**: 750 hours/month
- **WAF**: 1M requests/month

### Cost Monitoring
- **Billing Alerts**: SNS notifications
- **Cost Explorer**: Regular review
- **Resource Tagging**: Cost allocation

### Optimization Strategies
- **Right-sizing**: Monitor and adjust instance types
- **Storage Lifecycle**: Implement S3 lifecycle policies
- **Log Retention**: Set appropriate retention periods
- **Scheduled Scaling**: Scale down during off-hours

## Disaster Recovery

### Backup Strategy
- **S3**: Cross-region replication (optional)
- **EC2**: AMI snapshots (manual)
- **Configuration**: Terraform state backup

### Recovery Procedures
1. **Infrastructure**: `terraform apply`
2. **Data**: Restore from S3
3. **Application**: User data script handles setup
4. **DNS**: Update Route53 records (if applicable)

### RTO/RPO
- **RTO**: 30 minutes (infrastructure) + 15 minutes (data)
- **RPO**: 5 minutes (S3 eventual consistency)

## Compliance and Governance

### Regulatory Compliance
- **GDPR**: Data masking and encryption
- **SOC 2**: Security controls implemented
- **PCI DSS**: Not applicable (no payment data)

### Governance
- **Resource Tagging**: Consistent tagging strategy
- **Access Control**: IAM-based access management
- **Audit Logging**: CloudTrail (if enabled)
- **Change Management**: Terraform state management

## Monitoring and Alerting

### Key Metrics
- **Availability**: 99.9% target
- **Response Time**: < 200ms average
- **Error Rate**: < 1%
- **CPU Utilization**: < 70%

### Alerting Strategy
- **Critical**: Immediate SNS notification
- **Warning**: CloudWatch alarm
- **Info**: Log analysis

### Dashboards
- **Infrastructure**: CloudWatch dashboard
- **Application**: Custom metrics
- **Security**: WAF logs analysis

## Maintenance and Operations

### Regular Tasks
- **Security Updates**: AMI updates
- **Dependency Updates**: Python packages
- **Log Rotation**: CloudWatch log retention
- **Cost Review**: Monthly cost analysis

### Automation
- **Deployment**: Terraform
- **Configuration**: User data scripts
- **Monitoring**: CloudWatch alarms
- **Scaling**: Auto Scaling Groups (future)

## Future Enhancements

### Short Term
- **Auto Scaling**: Implement Auto Scaling Groups
- **RDS**: Add database for persistent data
- **CloudFront**: Add CDN for global distribution
- **SSL/TLS**: Enable HTTPS by default

### Long Term
- **Multi-AZ**: Deploy across multiple regions
- **Microservices**: Break down monolithic application
- **CI/CD**: Implement automated deployment
- **Machine Learning**: Add ML-based threat detection

## Troubleshooting Guide

### Common Issues
1. **Application not accessible**
   - Check ALB health checks
   - Verify security groups
   - Check EC2 instance status

2. **Dataset not loading**
   - Verify S3 permissions
   - Check IAM role
   - Confirm file exists

3. **WAF blocking requests**
   - Review WAF logs
   - Check rate limiting
   - Verify IP deny list

4. **High costs**
   - Review Free Tier usage
   - Check for non-Free Tier resources
   - Monitor S3 storage

### Debugging Commands
```bash
# Check instance status
aws ec2 describe-instances --instance-ids i-1234567890abcdef0

# Check ALB health
aws elbv2 describe-target-health --target-group-arn arn:aws:elasticloadbalancing:...

# Check S3 contents
aws s3 ls s3://bucket-name/

# Check CloudWatch logs
aws logs describe-log-streams --log-group-name /aws/ec2/cyber-eda-aws
```

This architecture provides a robust, secure, and cost-effective foundation for the cybersecurity dashboard while maintaining compliance with academic requirements and AWS best practices.
