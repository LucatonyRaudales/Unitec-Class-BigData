# Cybersecurity Dashboard - Infrastructure as Code

## 🏗️ Project Overview

This repository contains a complete Terraform infrastructure for deploying a cybersecurity dashboard application on AWS. The application displays masked cybersecurity attack data with filtering capabilities, deployed behind an Application Load Balancer with WAF protection and CloudWatch monitoring.

## 📋 Features

- **🛡️ Security First**: WAF with OWASP rules, data masking, encryption
- **💰 Cost Optimized**: Free Tier friendly, optional paid features
- **📊 Monitoring**: CloudWatch metrics, alarms, and logging
- **🔒 Compliance**: GDPR-ready with data masking
- **⚡ Scalable**: ALB ready for multiple instances
- **🌐 Global**: Optional CloudFront CDN support

## 🏛️ Architecture

```
Internet → WAF → ALB → EC2 (Flask) → S3 (Dataset)
                    ↓
              CloudWatch (Monitoring)
```

## 📁 Repository Structure

```
infra/
├── main.tf                    # Main Terraform configuration
├── variables.tf               # Variable definitions
├── outputs.tf                 # Output values
├── providers.tf               # Provider configuration
├── versions.tf                # Version constraints
├── backend.tf                 # Backend configuration (optional)
├── terraform.tfvars.example   # Example variables file
├── DEPLOYMENT.md              # Detailed deployment guide
├── modules/                   # Terraform modules
│   ├── vpc/                   # VPC and networking
│   ├── security/              # Security groups
│   ├── s3/                    # S3 buckets and IAM
│   ├── ec2/                   # EC2 instance and user data
│   ├── alb/                   # Application Load Balancer
│   ├── waf/                   # Web Application Firewall
│   ├── cloudwatch/            # Monitoring and alarms
│   ├── acm/                   # SSL/TLS certificates (optional)
│   └── sns/                   # Notifications (optional)
├── templates/                 # User data templates
│   └── user_data.sh.tftpl    # EC2 bootstrap script
├── app/                       # Flask application
│   ├── app.py                 # Main application
│   ├── requirements.txt       # Python dependencies
│   └── README.md              # App documentation
├── data/                      # Sample data
│   └── sample_dataset.csv     # Example dataset
└── docs/                      # Documentation
    ├── README.md              # Infrastructure docs
    ├── ARCHITECTURE.md        # Detailed architecture
    └── DIAGRAM.md             # Mermaid diagrams
```

## 🚀 Quick Start

### Prerequisites

- **Terraform** >= 1.6
- **AWS CLI** configured
- **AWS Account** with appropriate permissions

### 1. Clone and Configure

```bash
git clone <repository-url>
cd infra

# Copy and edit variables
cp terraform.tfvars.example terraform.tfvars
nano terraform.tfvars
```

### 2. Deploy Infrastructure

```bash
# Initialize Terraform
terraform init

# Plan deployment
terraform plan

# Deploy infrastructure
terraform apply
```

### 3. Upload Dataset

```bash
# Upload sample dataset
aws s3 cp ./data/sample_dataset.csv s3://$(terraform output -raw dataset_bucket_name)/data/cyber_attacks_masked.csv

# Or upload your own dataset
aws s3 cp ./path/to/your/dataset.csv s3://$(terraform output -raw dataset_bucket_name)/data/cyber_attacks_masked.csv
```

### 4. Access Application

```bash
# Get application URL
echo "Application URL: http://$(terraform output -raw alb_dns_name)"
```

## ⚙️ Configuration

### Required Variables

```hcl
project_name = "cyber-eda-aws"
region       = "us-east-1"
```

### Optional Variables

```hcl
# Enable HTTPS (requires domain)
enable_acm     = true
domain_name    = "cyber-dashboard.example.com"
hosted_zone_id = "Z1234567890ABC"

# Enable notifications
enable_sns          = true
notification_email  = "admin@example.com"

# Security settings
allowed_ssh_cidr = "203.0.113.0/24"  # Your IP
waf_ip_deny_list = ["192.0.2.0/24"]  # IPs to block
alarm_cpu_threshold = 70
```

## 🛡️ Security Features

### Network Security
- **VPC Isolation**: Private network with public subnets
- **Security Groups**: Restrictive port access
- **WAF Protection**: OWASP rules, rate limiting, IP filtering

### Data Security
- **Data Masking**: IPs, emails, usernames masked
- **Encryption**: S3 SSE-S3, EBS encryption
- **Access Control**: IAM roles with least privilege

### Application Security
- **Input Validation**: All user inputs validated
- **Error Handling**: Graceful error handling
- **Logging**: Comprehensive audit logging

## 📊 Monitoring

### CloudWatch Metrics
- CPU utilization
- Memory usage
- Disk usage
- Network I/O

### Alarms
- CPU > 70% for 5 minutes
- Status check failed
- Instance reachability

### Logs
- Application logs
- System logs
- ALB access logs

## 💰 Cost Optimization

### Free Tier Eligible
- **EC2 t2.micro**: 750 hours/month
- **S3**: 5GB storage
- **CloudWatch**: 10 metrics
- **ALB**: 750 hours/month
- **WAF**: 1M requests/month

### Optional Costs
- **NAT Gateway**: ~$22/month
- **CloudFront**: ~$0.085/GB
- **SNS**: Free for email
- **ACM**: Free

## 🔧 Troubleshooting

### Common Issues

1. **Application not accessible**
   ```bash
   # Check ALB health
   aws elbv2 describe-target-health --target-group-arn $(terraform output -raw target_group_arn)
   ```

2. **Dataset not loading**
   ```bash
   # Check S3 permissions
   aws s3 ls s3://$(terraform output -raw dataset_bucket_name)/
   ```

3. **WAF blocking requests**
   ```bash
   # Check WAF logs
   aws logs describe-log-groups --log-group-name-prefix "aws-waf-logs"
   ```

### Debug Commands

```bash
# Check instance status
aws ec2 describe-instances --instance-ids $(terraform output -raw ec2_instance_id)

# Check application logs
aws logs tail $(terraform output -raw cloudwatch_log_group_name) --follow

# Check costs
aws ce get-cost-and-usage --time-period Start=2024-01-01,End=2024-01-31 --granularity MONTHLY --metrics BlendedCost
```

## 🧹 Cleanup

### Destroy Infrastructure

```bash
# Empty S3 buckets first
aws s3 rm s3://$(terraform output -raw dataset_bucket_name) --recursive
aws s3 rm s3://$(terraform output -raw dataset_bucket_name)-alb-logs --recursive

# Destroy infrastructure
terraform destroy
```

## 📚 Documentation

- **[Deployment Guide](DEPLOYMENT.md)**: Detailed deployment instructions
- **[Architecture Guide](docs/ARCHITECTURE.md)**: Comprehensive architecture documentation
- **[Diagrams](docs/DIAGRAM.md)**: Mermaid diagrams and visualizations
- **[App Documentation](app/README.md)**: Flask application documentation

## 🎯 Use Cases

### Academic Projects
- Cybersecurity data analysis
- Cloud infrastructure learning
- DevOps practices demonstration
- Security compliance examples

### Professional Development
- Infrastructure as Code training
- AWS services exploration
- Security best practices
- Cost optimization techniques

### Research and Analysis
- Attack pattern analysis
- Data visualization
- Security metrics
- Compliance reporting

## 🔄 Future Enhancements

### Short Term
- Auto Scaling Groups
- RDS database integration
- CloudFront CDN
- Enhanced monitoring

### Long Term
- Multi-region deployment
- Microservices architecture
- Machine learning integration
- Advanced analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the Final Project for Universidad Unitec - Seguridad con Grandes Volúmenes de Información.

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Review CloudWatch logs
3. Consult AWS documentation
4. Contact the development team

---

**Ready to deploy?** Start with the [Deployment Guide](DEPLOYMENT.md) for step-by-step instructions!
