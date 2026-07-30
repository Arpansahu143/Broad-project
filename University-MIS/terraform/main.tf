# =============================================================================
# University MIS - Main
# Entry point tying together networking, security, EKS, RDS, S3, IAM, and
# CloudWatch (each defined in its own file for readability/maintainability).
# =============================================================================

locals {
  name_prefix = "${var.project_name}-${var.environment}"

  # Merged into every resource's tags via provider default_tags where possible;
  # explicit merges are still used on resources that need dynamic tag values.
  common_tags = merge(var.common_tags, {
    Environment = var.environment
    Region      = var.aws_region
  })
}

data "aws_caller_identity" "current" {}
data "aws_availability_zones" "available" {
  state = "available"
}

# ---------------------------------------------------------------------------
# Post-cluster bootstrap: install core Helm charts required for production
# operation (cluster autoscaler, AWS Load Balancer Controller, metrics
# server). External Secrets and Prometheus/Grafana are intentionally left
# to be installed via the Helm charts referenced in monitoring/README.md
# so they can be versioned/upgraded independently of core infra.
# ---------------------------------------------------------------------------
resource "helm_release" "metrics_server" {
  name       = "metrics-server"
  repository = "https://kubernetes-sigs.github.io/metrics-server/"
  chart      = "metrics-server"
  namespace  = "kube-system"
  version    = "3.12.1"

  depends_on = [module.eks]
}

resource "helm_release" "aws_load_balancer_controller" {
  name       = "aws-load-balancer-controller"
  repository = "https://aws.github.io/eks-charts"
  chart      = "aws-load-balancer-controller"
  namespace  = "kube-system"
  version    = "1.8.1"

  set {
    name  = "clusterName"
    value = module.eks.cluster_name
  }

  set {
    name  = "serviceAccount.create"
    value = "true"
  }

  set {
    name  = "region"
    value = var.aws_region
  }

  set {
    name  = "vpcId"
    value = aws_vpc.main.id
  }

  depends_on = [module.eks]
}

resource "helm_release" "cluster_autoscaler" {
  name       = "cluster-autoscaler"
  repository = "https://kubernetes.github.io/autoscaler"
  chart      = "cluster-autoscaler"
  namespace  = "kube-system"
  version    = "9.37.0"

  set {
    name  = "autoDiscovery.clusterName"
    value = module.eks.cluster_name
  }

  set {
    name  = "awsRegion"
    value = var.aws_region
  }

  depends_on = [module.eks]
}
