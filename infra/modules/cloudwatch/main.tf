# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "main" {
  name              = "/aws/ec2/${var.project_name}"
  retention_in_days = 30

  tags = {
    Name = "${var.project_name}-log-group"
  }
}

# CloudWatch Alarm for CPU
resource "aws_cloudwatch_metric_alarm" "cpu_high" {
  alarm_name          = "${var.project_name}-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "300"
  statistic           = "Average"
  threshold           = var.alarm_cpu_threshold
  alarm_description   = "This metric monitors ec2 cpu utilization"
  alarm_actions       = var.enable_sns ? [var.sns_topic_arn] : []

  dimensions = {
    InstanceId = var.instance_id
  }

  tags = {
    Name = "${var.project_name}-cpu-alarm"
  }
}

# CloudWatch Alarm for Status Check Failed
resource "aws_cloudwatch_metric_alarm" "status_check_failed" {
  alarm_name          = "${var.project_name}-status-check-failed"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "StatusCheckFailed"
  namespace           = "AWS/EC2"
  period              = "300"
  statistic           = "Average"
  threshold           = "0"
  alarm_description   = "This metric monitors ec2 status check failed"
  alarm_actions       = var.enable_sns ? [var.sns_topic_arn] : []

  dimensions = {
    InstanceId = var.instance_id
  }

  tags = {
    Name = "${var.project_name}-status-check-alarm"
  }
}

# CloudWatch Alarm for Instance Reachability
resource "aws_cloudwatch_metric_alarm" "instance_reachability" {
  alarm_name          = "${var.project_name}-instance-reachability"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "StatusCheckFailed_Instance"
  namespace           = "AWS/EC2"
  period              = "300"
  statistic           = "Average"
  threshold           = "0"
  alarm_description   = "This metric monitors ec2 instance reachability"
  alarm_actions       = var.enable_sns ? [var.sns_topic_arn] : []

  dimensions = {
    InstanceId = var.instance_id
  }

  tags = {
    Name = "${var.project_name}-reachability-alarm"
  }
}
