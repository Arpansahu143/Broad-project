# =============================================================================
# University MIS - EKS Cluster
# Managed Kubernetes control plane + managed node group, using the
# community terraform-aws-modules/eks module for production-grade defaults
# (IRSA, OIDC provider, encryption, logging all wired up).
# =============================================================================

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.24"

  cluster_name    = "${var.project_name}-cluster"
  cluster_version = var.eks_cluster_version

  vpc_id                   = aws_vpc.main.id
  subnet_ids                = aws_subnet.private[*].id
  control_plane_subnet_ids  = aws_subnet.private[*].id

  cluster_endpoint_public_access  = true
  cluster_endpoint_private_access = true

  # Encrypt Kubernetes secrets at rest using a dedicated KMS key
  cluster_encryption_config = {
    resources = ["secrets"]
  }

  # Control plane audit/API logs shipped to CloudWatch
  cluster_enabled_log_types = [
    "api", "audit", "authenticator", "controllerManager", "scheduler"
  ]

  enable_irsa = true

  eks_managed_node_groups = {
    general_purpose = {
      name           = "${var.project_name}-general"
      instance_types = var.eks_node_instance_types
      capacity_type  = "ON_DEMAND"

      min_size     = var.eks_node_min_size
      max_size     = var.eks_node_max_size
      desired_size = var.eks_node_desired_size

      labels = {
        "node-role" = "general-purpose"
      }

      block_device_mappings = {
        xvda = {
          device_name = "/dev/xvda"
          ebs = {
            volume_size           = 50
            volume_type            = "gp3"
            encrypted               = true
            delete_on_termination  = true
          }
        }
      }

      tags = var.common_tags
    }

    data_tier = {
      name           = "${var.project_name}-data-tier"
      instance_types = ["r6i.large"]
      capacity_type  = "ON_DEMAND"

      min_size     = 2
      max_size     = 4
      desired_size = 2

      labels = {
        "node-role" = "data-tier"
      }

      # Taint so only StatefulSets (postgres/redis) with matching
      # tolerations get scheduled onto these memory-optimized nodes.
      taints = {
        dedicated = {
          key    = "node-role"
          value  = "data-tier"
          effect = "NO_SCHEDULE"
        }
      }

      tags = var.common_tags
    }
  }

  # Cluster security group additional rule: allow nodes <-> control plane
  node_security_group_additional_rules = {
    ingress_self_all = {
      description = "Node to node all ports/protocols"
      protocol    = "-1"
      from_port   = 0
      to_port     = 0
      type        = "ingress"
      self        = true
    }
  }

  tags = var.common_tags
}

# ---------------------------------------------------------------------------
# Core cluster add-ons
# ---------------------------------------------------------------------------
resource "aws_eks_addon" "vpc_cni" {
  cluster_name = module.eks.cluster_name
  addon_name   = "vpc-cni"
}

resource "aws_eks_addon" "coredns" {
  cluster_name = module.eks.cluster_name
  addon_name   = "coredns"
  depends_on   = [module.eks]
}

resource "aws_eks_addon" "kube_proxy" {
  cluster_name = module.eks.cluster_name
  addon_name   = "kube-proxy"
}

resource "aws_eks_addon" "ebs_csi_driver" {
  cluster_name             = module.eks.cluster_name
  addon_name               = "aws-ebs-csi-driver"
  service_account_role_arn = aws_iam_role.ebs_csi_driver.arn
  depends_on                = [module.eks]
}
