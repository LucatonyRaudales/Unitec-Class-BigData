# Examen AWS - Disponibilidad y Almacenamiento Confiable
# Configuración independiente para el examen

# Availability zones for us-east-1
locals {
  availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c", "us-east-1d", "us-east-1e", "us-east-1f"]
}

# Random ID for bucket naming
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# VPC Module
module "vpc" {
  source = "../modules/vpc"

  project_name       = var.project_name
  vpc_cidr           = var.vpc_cidr
  public_subnets     = var.public_subnets
  availability_zones = local.availability_zones
}

# S3 resources are defined in s3_examen.tf

# Security Groups Module
module "security" {
  source = "../modules/security"

  project_name       = var.project_name
  vpc_id             = module.vpc.vpc_id
  allowed_ssh_cidr   = var.allowed_ssh_cidr
  alb_security_group = null
}

# Security Group for Examen EC2 instances (Apache)
resource "aws_security_group" "examen_ec2_sg" {
  name_prefix = "${var.project_name}-examen-ec2-"
  vpc_id      = module.vpc.vpc_id

  # HTTP access
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS access
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # SSH access (limited to specific CIDR)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_ssh_cidr != "" ? [var.allowed_ssh_cidr] : ["0.0.0.0/0"]
  }

  # All outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-examen-ec2-sg"
  }
}

# Security Group for Examen ALB
resource "aws_security_group" "examen_alb_sg" {
  name_prefix = "${var.project_name}-examen-alb-"
  vpc_id      = module.vpc.vpc_id

  # HTTP access
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS access
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # All outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-examen-alb-sg"
  }
}

# User data script for Apache installation and dataset setup
locals {
  apache_user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y httpd awscli
    
    # Start and enable Apache
    systemctl start httpd
    systemctl enable httpd
    
    # Create directory for dataset
    mkdir -p /var/www/html
    
    # Download dataset from S3
    aws s3 cp s3://${aws_s3_bucket.examen_dataset.bucket}/data/dataset_limpio.csv /var/www/html/dataset_limpio.csv
    
    # Set proper permissions
    chown apache:apache /var/www/html/dataset_limpio.csv
    chmod 644 /var/www/html/dataset_limpio.csv
    
    # Get instance metadata
    INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)
    PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
    AZ=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone)
    
    # Create a simple index.html for the examen
    cat > /var/www/html/index.html << EOL
    <!DOCTYPE html>
    <html>
    <head>
        <title>Examen AWS - Dataset</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                margin: 0;
                padding: 40px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .card { 
                max-width: 500px; 
                width: 100%;
                background: rgba(255,255,255,0.15);
                padding: 40px;
                border-radius: 20px;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
                text-align: center;
                border: 1px solid rgba(255,255,255,0.3);
            }
            h1 { 
                color: #fff; 
                margin-bottom: 20px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                font-size: 2.2em;
            }
            .ip-highlight {
                color: #ffeb3b;
                font-weight: bold;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
                font-size: 1.5em;
                margin: 20px 0;
                display: block;
            }
            .download-link { 
                display: inline-block; 
                background: linear-gradient(45deg, #ff6b6b, #ee5a24); 
                color: white; 
                padding: 20px 40px; 
                text-decoration: none; 
                border-radius: 30px; 
                margin-top: 30px; 
                font-weight: bold;
                font-size: 1.2em;
                transition: transform 0.3s ease;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            }
            .download-link:hover { 
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            }
        </style>
    </head>
    <body>
        <div class="card">
            <h1>🎯 Examen AWS - Dataset</h1>
            <span class="ip-highlight">IP: $PUBLIC_IP</span>
            <a href="dataset_limpio.csv" class="download-link">📥 Descargar Dataset (CSV)</a>
        </div>
    </body>
    </html>
    EOL
    
    # Set proper permissions for index.html
    chown apache:apache /var/www/html/index.html
    chmod 644 /var/www/html/index.html
    
    # Create a simple health check endpoint
    cat > /var/www/html/health << 'EOL'
    OK
    EOL
    
    chown apache:apache /var/www/html/health
    chmod 644 /var/www/html/health
    EOF
}

# First Examen EC2 Instance
resource "aws_instance" "examen_ec2_1" {
  ami                    = "ami-0c02fb55956c7d316" # Amazon Linux 2
  instance_type          = var.instance_type
  subnet_id              = module.vpc.public_subnet_ids[0]
  vpc_security_group_ids = [aws_security_group.examen_ec2_sg.id]
  iam_instance_profile   = aws_iam_instance_profile.examen_ec2_s3_access.name

  user_data = base64encode(local.apache_user_data)

  tags = {
    Name = "${var.project_name}-examen-ec2-1"
    Type = "Examen-Instance"
    Purpose = "AWS-Examen"
  }

  depends_on = [aws_s3_object.examen_dataset]
}

# Second Examen EC2 Instance
resource "aws_instance" "examen_ec2_2" {
  ami                    = "ami-0c02fb55956c7d316" # Amazon Linux 2
  instance_type          = var.instance_type
  subnet_id              = module.vpc.public_subnet_ids[1]
  vpc_security_group_ids = [aws_security_group.examen_ec2_sg.id]
  iam_instance_profile   = aws_iam_instance_profile.examen_ec2_s3_access.name

  user_data = base64encode(local.apache_user_data)

  tags = {
    Name = "${var.project_name}-examen-ec2-2"
    Type = "Examen-Instance"
    Purpose = "AWS-Examen"
  }

  depends_on = [aws_s3_object.examen_dataset]
}

# Application Load Balancer for Examen
resource "aws_lb" "examen_alb" {
  name               = "${var.project_name}-examen-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.examen_alb_sg.id]
  subnets            = module.vpc.public_subnet_ids

  enable_deletion_protection = false

  tags = {
    Name = "${var.project_name}-examen-alb"
    Purpose = "AWS-Examen"
  }
}

# Target Group for Examen ALB
resource "aws_lb_target_group" "examen_tg" {
  name     = "${var.project_name}-examen-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = module.vpc.vpc_id

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = "/health"
    matcher             = "200"
    port                = "traffic-port"
    protocol            = "HTTP"
  }

  tags = {
    Name = "${var.project_name}-examen-tg"
    Purpose = "AWS-Examen"
  }
}

# Attach EC2 instances to target group
resource "aws_lb_target_group_attachment" "examen_tg_attachment_1" {
  target_group_arn = aws_lb_target_group.examen_tg.arn
  target_id        = aws_instance.examen_ec2_1.id
  port             = 80
}

resource "aws_lb_target_group_attachment" "examen_tg_attachment_2" {
  target_group_arn = aws_lb_target_group.examen_tg.arn
  target_id        = aws_instance.examen_ec2_2.id
  port             = 80
}

# ALB Listener
resource "aws_lb_listener" "examen_alb_listener" {
  load_balancer_arn = aws_lb.examen_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.examen_tg.arn
  }
}

# CloudWatch Log Group for ALB Access Logs
resource "aws_cloudwatch_log_group" "examen_alb_logs" {
  name              = "/aws/applicationloadbalancer/${var.project_name}-examen"
  retention_in_days = 7

  tags = {
    Name = "${var.project_name}-examen-alb-logs"
    Purpose = "AWS-Examen"
  }
}

# CloudWatch Log Group for EC2 Instance Logs
resource "aws_cloudwatch_log_group" "examen_ec2_logs" {
  name              = "/aws/ec2/${var.project_name}-examen"
  retention_in_days = 7

  tags = {
    Name = "${var.project_name}-examen-ec2-logs"
    Purpose = "AWS-Examen"
  }
}

# CloudWatch Dashboard for Examen
resource "aws_cloudwatch_dashboard" "examen_dashboard" {
  dashboard_name = "${var.project_name}-examen-dashboard"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/ApplicationELB", "RequestCount", "LoadBalancer", aws_lb.examen_alb.arn_suffix],
            [".", "TargetResponseTime", ".", "."],
            [".", "HTTPCode_Target_2XX_Count", ".", "."],
            [".", "HTTPCode_Target_4XX_Count", ".", "."],
            [".", "HTTPCode_Target_5XX_Count", ".", "."]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.region
          title   = "ALB Metrics - Examen"
          period  = 300
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/EC2", "CPUUtilization", "InstanceId", aws_instance.examen_ec2_1.id],
            [".", ".", ".", aws_instance.examen_ec2_2.id]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.region
          title   = "EC2 CPU Utilization - Examen"
          period  = 300
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 12
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/ApplicationELB", "HealthyHostCount", "LoadBalancer", aws_lb.examen_alb.arn_suffix],
            [".", "UnHealthyHostCount", ".", "."]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.region
          title   = "Target Group Health - Examen"
          period  = 300
        }
      }
    ]
  })
}

# CloudWatch Alarms for Examen
resource "aws_cloudwatch_metric_alarm" "examen_alb_high_5xx" {
  alarm_name          = "${var.project_name}-examen-alb-high-5xx"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "HTTPCode_Target_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = "300"
  statistic           = "Sum"
  threshold           = "10"
  alarm_description   = "This metric monitors ALB 5xx errors for examen"
  alarm_actions       = var.enable_sns ? [module.sns[0].topic_arn] : []

  dimensions = {
    LoadBalancer = aws_lb.examen_alb.arn_suffix
  }

  tags = {
    Purpose = "AWS-Examen"
  }
}

resource "aws_cloudwatch_metric_alarm" "examen_ec2_high_cpu" {
  alarm_name          = "${var.project_name}-examen-ec2-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "300"
  statistic           = "Average"
  threshold           = var.alarm_cpu_threshold
  alarm_description   = "This metric monitors EC2 CPU utilization for examen"
  alarm_actions       = var.enable_sns ? [module.sns[0].topic_arn] : []

  dimensions = {
    InstanceId = aws_instance.examen_ec2_1.id
  }

  tags = {
    Purpose = "AWS-Examen"
  }
}

# SNS Module (Optional)
module "sns" {
  count = var.enable_sns ? 1 : 0

  source = "../modules/sns"

  project_name       = var.project_name
  notification_email = var.notification_email
}
