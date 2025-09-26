# Examen AWS - Outputs

# VPC Outputs
output "examen_vpc_id" {
  description = "ID of the VPC for examen"
  value       = module.vpc.vpc_id
}

output "examen_public_subnet_ids" {
  description = "IDs of the public subnets for examen"
  value       = module.vpc.public_subnet_ids
}

# S3 Outputs
output "examen_s3_bucket_name" {
  description = "Name of the S3 bucket containing the dataset for examen"
  value       = aws_s3_bucket.examen_dataset.bucket
}

# EC2 Outputs
output "examen_ec2_instance_1_id" {
  description = "ID of the first examen EC2 instance"
  value       = aws_instance.examen_ec2_1.id
}

output "examen_ec2_instance_1_public_ip" {
  description = "Public IP of the first examen EC2 instance"
  value       = aws_instance.examen_ec2_1.public_ip
}

output "examen_ec2_instance_1_public_dns" {
  description = "Public DNS of the first examen EC2 instance"
  value       = aws_instance.examen_ec2_1.public_dns
}

output "examen_ec2_instance_2_id" {
  description = "ID of the second examen EC2 instance"
  value       = aws_instance.examen_ec2_2.id
}

output "examen_ec2_instance_2_public_ip" {
  description = "Public IP of the second examen EC2 instance"
  value       = aws_instance.examen_ec2_2.public_ip
}

output "examen_ec2_instance_2_public_dns" {
  description = "Public DNS of the second examen EC2 instance"
  value       = aws_instance.examen_ec2_2.public_dns
}

# Load Balancer Outputs
output "examen_alb_dns_name" {
  description = "DNS name of the Application Load Balancer for examen"
  value       = aws_lb.examen_alb.dns_name
}

output "examen_alb_zone_id" {
  description = "Zone ID of the Application Load Balancer for examen"
  value       = aws_lb.examen_alb.zone_id
}

output "examen_alb_arn" {
  description = "ARN of the Application Load Balancer for examen"
  value       = aws_lb.examen_alb.arn
}

# Target Group Outputs
output "examen_target_group_arn" {
  description = "ARN of the target group for examen"
  value       = aws_lb_target_group.examen_tg.arn
}

# Security Group Outputs
output "examen_ec2_security_group_id" {
  description = "ID of the EC2 security group for examen"
  value       = aws_security_group.examen_ec2_sg.id
}

output "examen_alb_security_group_id" {
  description = "ID of the ALB security group for examen"
  value       = aws_security_group.examen_alb_sg.id
}

# CloudWatch Outputs
output "examen_cloudwatch_dashboard_url" {
  description = "URL of the CloudWatch dashboard for examen"
  value       = "https://${var.region}.console.aws.amazon.com/cloudwatch/home?region=${var.region}#dashboards:name=${aws_cloudwatch_dashboard.examen_dashboard.dashboard_name}"
}

output "examen_alb_log_group_name" {
  description = "Name of the ALB CloudWatch log group for examen"
  value       = aws_cloudwatch_log_group.examen_alb_logs.name
}

output "examen_ec2_log_group_name" {
  description = "Name of the EC2 CloudWatch log group for examen"
  value       = aws_cloudwatch_log_group.examen_ec2_logs.name
}

# Access URLs
output "examen_access_urls" {
  description = "URLs to access the examen infrastructure"
  value = {
    load_balancer = "http://${aws_lb.examen_alb.dns_name}"
    instance_1    = "http://${aws_instance.examen_ec2_1.public_ip}"
    instance_2    = "http://${aws_instance.examen_ec2_2.public_ip}"
    dataset_1     = "http://${aws_instance.examen_ec2_1.public_ip}/dataset_limpio.csv"
    dataset_2     = "http://${aws_instance.examen_ec2_2.public_ip}/dataset_limpio.csv"
    dataset_lb    = "http://${aws_lb.examen_alb.dns_name}/dataset_limpio.csv"
    health_check  = "http://${aws_lb.examen_alb.dns_name}/health"
  }
}

# Instructions for Examen
output "examen_instructions" {
  description = "Instructions for using the examen infrastructure"
  value = <<-EOT
    🎯 EXAMEN AWS - Infraestructura Desplegada Exitosamente!
    
    📋 OBJETIVOS CUMPLIDOS:
    ✅ 1. Dataset en instancias EC2 con Apache
    ✅ 2. Balanceador de Carga (ELB) configurado
    ✅ 3. Seguridad con Security Groups
    ✅ 4. Logs en CloudWatch
    
    🔗 URLs DE ACCESO:
    - Load Balancer: http://${aws_lb.examen_alb.dns_name}
    - Instancia 1: http://${aws_instance.examen_ec2_1.public_ip}
    - Instancia 2: http://${aws_instance.examen_ec2_2.public_ip}
    
    📊 DATASET:
    - Via Load Balancer: http://${aws_lb.examen_alb.dns_name}/dataset_limpio.csv
    - Directo Instancia 1: http://${aws_instance.examen_ec2_1.public_ip}/dataset_limpio.csv
    - Directo Instancia 2: http://${aws_instance.examen_ec2_2.public_ip}/dataset_limpio.csv
    
    📈 MONITOREO:
    - CloudWatch Dashboard: https://${var.region}.console.aws.amazon.com/cloudwatch/home?region=${var.region}#dashboards:name=${aws_cloudwatch_dashboard.examen_dashboard.dashboard_name}
    
    🔒 SEGURIDAD:
    - EC2 Security Group: ${aws_security_group.examen_ec2_sg.id}
    - ALB Security Group: ${aws_security_group.examen_alb_sg.id}
    
    📝 LOGS:
    - ALB Logs: ${aws_cloudwatch_log_group.examen_alb_logs.name}
    - EC2 Logs: ${aws_cloudwatch_log_group.examen_ec2_logs.name}
    
    🧪 PRUEBAS:
    1. Acceder al Load Balancer URL múltiples veces
    2. Verificar que el dataset se descarga correctamente
    3. Revisar el CloudWatch Dashboard para métricas
    4. Verificar que las requests se distribuyen entre instancias
    5. Comprobar los logs de acceso en CloudWatch
    
    📸 EVIDENCIAS REQUERIDAS:
    - Captura de pantalla del Load Balancer funcionando
    - Captura de pantalla de las instancias EC2
    - Captura de pantalla del Security Groups
    - Captura de pantalla del CloudWatch Dashboard
    - Captura de pantalla del dataset descargándose
    - URL del balanceador de carga funcionando
  EOT
}
