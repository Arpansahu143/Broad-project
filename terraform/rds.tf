# =============================================================================
# University MIS - RDS PostgreSQL
# Managed PostgreSQL instance in isolated database subnets, Multi-AZ for
# high availability, encrypted at rest, automated backups, and a randomly
# generated master password stored in AWS Secrets Manager (never in state
# as plaintext beyond what Terraform requires).
# =============================================================================

resource "random_password" "db_master" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "aws_secretsmanager_secret" "db_credentials" {
  name        = "${var.project_name}/rds/master-credentials"
  description = "Master credentials for the University MIS RDS PostgreSQL instance"
  tags        = var.common_tags
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    username = var.db_username
    password = random_password.db_master.result
    engine   = "postgres"
    host     = aws_db_instance.main.address
    port     = 5432
    dbname   = var.db_name
  })
}

resource "aws_kms_key" "rds" {
  description             = "KMS key for encrypting the University MIS RDS instance"
  deletion_window_in_days = 30
  enable_key_rotation     = true
  tags                    = var.common_tags
}

resource "aws_db_parameter_group" "main" {
  name   = "${var.project_name}-postgres16-params"
  family = "postgres16"

  parameter {
    name  = "log_statement"
    value = "ddl"
  }

  parameter {
    name  = "log_min_duration_statement"
    value = "1000" # log queries slower than 1s
  }

  tags = var.common_tags
}

resource "aws_db_instance" "main" {
  identifier     = "${var.project_name}-postgres"
  engine         = "postgres"
  engine_version = var.db_engine_version
  instance_class = var.db_instance_class

  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage
  storage_type           = "gp3"
  storage_encrypted      = true
  kms_key_id              = aws_kms_key.rds.arn

  db_name  = var.db_name
  username = var.db_username
  password = random_password.db_master.result
  port     = 5432

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  parameter_group_name   = aws_db_parameter_group.main.name

  multi_az            = var.db_multi_az
  publicly_accessible = false

  backup_retention_period   = 14
  backup_window              = "03:00-04:00"
  maintenance_window         = "sun:04:30-sun:05:30"
  copy_tags_to_snapshot      = true
  deletion_protection        = var.environment == "production"
  skip_final_snapshot        = var.environment != "production"
  final_snapshot_identifier  = var.environment == "production" ? "${var.project_name}-final-snapshot" : null

  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  performance_insights_enabled          = true
  performance_insights_retention_period = 7

  auto_minor_version_upgrade = true
  apply_immediately          = false

  tags = merge(var.common_tags, { Name = "${var.project_name}-postgres" })
}

# ---------------------------------------------------------------------------
# Optional: ElastiCache Redis (managed alternative to in-cluster Redis)
# ---------------------------------------------------------------------------
resource "aws_elasticache_subnet_group" "main" {
  name       = "${var.project_name}-redis-subnet-group"
  subnet_ids = aws_subnet.private[*].id
}

resource "aws_elasticache_replication_group" "main" {
  replication_group_id = "${var.project_name}-redis"
  description           = "University MIS Redis cache"

  engine                = "redis"
  engine_version         = "7.1"
  node_type              = "cache.t3.medium"
  num_cache_clusters      = 2
  port                    = 6379

  subnet_group_name  = aws_elasticache_subnet_group.main.name
  security_group_ids = [aws_security_group.redis.id]

  automatic_failover_enabled = true
  multi_az_enabled           = true

  at_rest_encryption_enabled = true
  transit_encryption_enabled  = true
  auth_token                  = random_password.redis_auth.result

  snapshot_retention_limit = 5
  snapshot_window           = "05:00-06:00"

  tags = var.common_tags
}

resource "random_password" "redis_auth" {
  length  = 32
  special = false # ElastiCache AUTH tokens disallow some special characters
}
