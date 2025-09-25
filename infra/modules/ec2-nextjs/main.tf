# Data source for latest Amazon Linux 2023 AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# User data template for Next.js deployment
locals {
  user_data = templatefile("${path.root}/templates/deploy_dashboard.sh.tftpl", {
    dataset_bucket_name = var.dataset_bucket_name
    dataset_s3_key      = var.dataset_s3_key
  })
}

# EC2 Instance for Next.js app
resource "aws_instance" "main" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.instance_type
  subnet_id              = var.subnet_id
  vpc_security_group_ids = var.security_group_ids
  iam_instance_profile   = var.iam_instance_profile

  user_data = local.user_data

  root_block_device {
    volume_type = "gp3"
    volume_size = 50
    encrypted   = true

    tags = {
      Name = "${var.project_name}-nextjs-root-volume"
    }
  }

  tags = {
    Name = "${var.project_name}-nextjs-instance"
  }
}
