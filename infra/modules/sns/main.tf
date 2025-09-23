# SNS Topic
resource "aws_sns_topic" "main" {
  name = "${var.project_name}-alerts"

  tags = {
    Name = "${var.project_name}-sns-topic"
  }
}

# SNS Topic Subscription
resource "aws_sns_topic_subscription" "email" {
  topic_arn = aws_sns_topic.main.arn
  protocol  = "email"
  endpoint  = var.notification_email
}
