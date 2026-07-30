# =============================================================================
# University MIS - Security Groups
# Least-privilege security groups for the ALB, EKS nodes, RDS, Redis (if
# using ElastiCache), and the administrative bastion host.
# =============================================================================

# ---------------------------------------------------------------------------
# ALB / Ingress security group - public HTTPS/HTTP only
# ---------------------------------------------------------------------------
resource "aws_security_group" "alb" {
  name        = "${var.project_name}-alb-sg"
  description = "Security group for the public-facing load balancer"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "HTTPS from the internet"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP (redirected to HTTPS at the ingress/ALB level)"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "All outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.common_tags, { Name = "${var.project_name}-alb-sg" })
}

# ---------------------------------------------------------------------------
# EKS worker node security group
# ---------------------------------------------------------------------------
resource "aws_security_group" "eks_nodes" {
  name        = "${var.project_name}-eks-nodes-sg"
  description = "Security group for EKS worker nodes"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Traffic from the ALB"
    from_port       = 0
    to_port         = 65535
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  ingress {
    description = "Node-to-node communication"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    self        = true
  }

  egress {
    description = "All outbound (pulling images, calling AWS APIs, etc.)"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.common_tags, {
    Name                                                = "${var.project_name}-eks-nodes-sg"
    "kubernetes.io/cluster/${var.project_name}-cluster" = "owned"
  })
}

# ---------------------------------------------------------------------------
# RDS security group - only reachable from EKS worker nodes
# ---------------------------------------------------------------------------
resource "aws_security_group" "rds" {
  name        = "${var.project_name}-rds-sg"
  description = "Security group for RDS PostgreSQL - only accessible from EKS nodes and bastion"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "PostgreSQL from EKS worker nodes"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_nodes.id]
  }

  ingress {
    description     = "PostgreSQL from bastion (for migrations/admin)"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  egress {
    description = "No outbound needed for RDS"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.common_tags, { Name = "${var.project_name}-rds-sg" })
}

# ---------------------------------------------------------------------------
# Bastion host security group - SSH restricted to a trusted CIDR only
# ---------------------------------------------------------------------------
resource "aws_security_group" "bastion" {
  name        = "${var.project_name}-bastion-sg"
  description = "Security group for the administrative bastion host"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "SSH from trusted network only"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_allowed_cidr]
  }

  egress {
    description = "All outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.common_tags, { Name = "${var.project_name}-bastion-sg" })
}

# ---------------------------------------------------------------------------
# ElastiCache Redis security group (used if Redis is run as a managed AWS
# service instead of in-cluster; see redis-deployment.yaml for the
# in-cluster alternative)
# ---------------------------------------------------------------------------
resource "aws_security_group" "redis" {
  name        = "${var.project_name}-redis-sg"
  description = "Security group for ElastiCache Redis - only accessible from EKS nodes"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Redis from EKS worker nodes"
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_nodes.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.common_tags, { Name = "${var.project_name}-redis-sg" })
}
