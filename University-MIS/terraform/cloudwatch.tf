# =============================================================================
# University MIS - CloudWatch
# Log groups (VPC flow logs, EKS control plane), core infrastructure alarms,
# and an SNS topic for alert notifications.
# =============================================================================

resource "aws_cloudwatch_log_group" "vpc_flow_logs" {
  name              = "/aws/vpc/${var.project_name}/flow-logs"
  retention_in_days = 30
  tags              = var.common_tags
}

resource "aws_cloudwatch_log_group" "eks_cluster" {
  name              = "/aws/eks/${var.project_name}-cluster/cluster"
  retention_in_days = 30
  tags              = var.common_tags
}

resource "aws_cloudwatch_log_group" "application" {
  name              = "/university-mis/application"
  retention_in_days = 14
  tags              = var.common_tags
}

# ---------------------------------------------------------------------------
# SNS topic for alarm notifications
# ---------------------------------------------------------------------------
resource "aws_sns_topic" "alerts" {
  name = "${var.project_name}-alerts"
  tags = var.common_tags
}

resource "aws_sns_topic_subscription" "email_alerts" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = "devops-team@university.edu" # replace with your on-call distribution list
}

# ---------------------------------------------------------------------------
# RDS Alarms
# ---------------------------------------------------------------------------
resource "aws_cloudwatch_metric_alarm" "rds_cpu_high" {
  alarm_name          = "${var.project_name}-rds-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "RDS CPU utilization exceeded 80% for 15 minutes"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.main.id
  }
}

resource "aws_cloudwatch_metric_alarm" "rds_storage_low" {
  alarm_name          = "${var.project_name}-rds-free-storage-low"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 2
  metric_name         = "FreeStorageSpace"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 5368709120 # 5 GB in bytes
  alarm_description   = "RDS free storage space below 5GB"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.main.id
  }
}

resource "aws_cloudwatch_metric_alarm" "rds_connections_high" {
  alarm_name          = "${var.project_name}-rds-connections-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "DatabaseConnections"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 150
  alarm_description   = "RDS connection count is approaching capacity"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.main.id
  }
}

# ---------------------------------------------------------------------------
# EKS / Node Group Alarms (via the underlying ASG)
# ---------------------------------------------------------------------------
resource "aws_cloudwatch_metric_alarm" "eks_node_cpu_high" {
  alarm_name          = "${var.project_name}-eks-node-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 300
  statistic           = "Average"
  threshold           = 85
  alarm_description   = "EKS worker node average CPU exceeded 85%"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    AutoScalingGroupName = module.eks.eks_managed_node_groups["general_purpose"].node_group_autoscaling_group_names[0]
  }
}

# ---------------------------------------------------------------------------
# ALB Alarms
# ---------------------------------------------------------------------------
resource "aws_cloudwatch_metric_alarm" "alb_5xx_high" {
  alarm_name          = "${var.project_name}-alb-5xx-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "HTTPCode_ELB_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = 300
  statistic           = "Sum"
  threshold           = 50
  alarm_description   = "Elevated rate of 5xx errors from the load balancer"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  treat_missing_data  = "notBreaching"
}

# ---------------------------------------------------------------------------
# CloudWatch Dashboard
# ---------------------------------------------------------------------------
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.project_name}-overview"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          title   = "RDS CPU Utilization"
          metrics = [["AWS/RDS", "CPUUtilization", "DBInstanceIdentifier", aws_db_instance.main.id]]
          period  = 300
          stat    = "Average"
          region  = var.aws_region
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6
        properties = {
          title   = "ALB Request Count / 5xx Errors"
          metrics = [
            ["AWS/ApplicationELB", "RequestCount"],
            ["AWS/ApplicationELB", "HTTPCode_ELB_5XX_Count"]
          ]
          period = 300
          stat   = "Sum"
          region = var.aws_region
        }
      }
    ]
  })
}
