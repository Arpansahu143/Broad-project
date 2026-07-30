# =============================================================================
# University MIS - Terraform Outputs
# =============================================================================

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = aws_subnet.private[*].id
}

output "database_subnet_ids" {
  description = "IDs of the database subnets"
  value       = aws_subnet.database[*].id
}

output "eks_cluster_name" {
  description = "Name of the EKS cluster"
  value       = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  description = "Endpoint for the EKS control plane"
  value       = module.eks.cluster_endpoint
}

output "eks_cluster_certificate_authority_data" {
  description = "Base64-encoded certificate data for the EKS cluster"
  value       = module.eks.cluster_certificate_authority_data
  sensitive   = true
}

output "eks_oidc_provider_arn" {
  description = "ARN of the EKS OIDC provider (used for IRSA)"
  value       = module.eks.oidc_provider_arn
}

output "kubeconfig_command" {
  description = "Command to configure kubectl for this cluster"
  value       = "aws eks update-kubeconfig --name ${module.eks.cluster_name} --region ${var.aws_region}"
}

output "rds_endpoint" {
  description = "Connection endpoint for the RDS PostgreSQL instance"
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}

output "rds_instance_id" {
  description = "RDS instance identifier"
  value       = aws_db_instance.main.id
}

output "db_credentials_secret_arn" {
  description = "ARN of the Secrets Manager secret holding RDS master credentials"
  value       = aws_secretsmanager_secret.db_credentials.arn
}

output "redis_primary_endpoint" {
  description = "Primary endpoint for the ElastiCache Redis replication group"
  value       = aws_elasticache_replication_group.main.primary_endpoint_address
  sensitive   = true
}

output "s3_app_storage_bucket" {
  description = "Name of the S3 bucket used for application storage"
  value       = aws_s3_bucket.app_storage.bucket
}

output "backend_irsa_role_arn" {
  description = "ARN of the IAM role assumed by the backend pods via IRSA"
  value       = aws_iam_role.backend_app.arn
}

output "bastion_public_ip" {
  description = "Public IP of the bastion host"
  value       = aws_instance.bastion.public_ip
}

output "cloudwatch_dashboard_url" {
  description = "URL to the CloudWatch dashboard"
  value       = "https://${var.aws_region}.console.aws.amazon.com/cloudwatch/home?region=${var.aws_region}#dashboards:name=${aws_cloudwatch_dashboard.main.dashboard_name}"
}
