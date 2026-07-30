# =============================================================================
# University MIS - Terraform Variables
# =============================================================================

variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment (staging | production)"
  type        = string
  default     = "production"

  validation {
    condition     = contains(["staging", "production"], var.environment)
    error_message = "environment must be either 'staging' or 'production'."
  }
}

variable "project_name" {
  description = "Short project identifier used in resource naming"
  type        = string
  default     = "university-mis"
}

# ---------------------------------------------------------------------------
# Networking
# ---------------------------------------------------------------------------
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones to spread subnets across"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets (one per AZ)"
  type        = list(string)
  default     = ["10.0.0.0/24", "10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets (one per AZ)"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.11.0/24", "10.0.12.0/24"]
}

variable "database_subnet_cidrs" {
  description = "CIDR blocks for isolated database subnets (one per AZ)"
  type        = list(string)
  default     = ["10.0.20.0/24", "10.0.21.0/24", "10.0.22.0/24"]
}

# ---------------------------------------------------------------------------
# EKS
# ---------------------------------------------------------------------------
variable "eks_cluster_version" {
  description = "Kubernetes version for the EKS control plane"
  type        = string
  default     = "1.30"
}

variable "eks_node_instance_types" {
  description = "EC2 instance types for the general-purpose EKS managed node group"
  type        = list(string)
  default     = ["t3.large"]
}

variable "eks_node_min_size" {
  type    = number
  default = 3
}

variable "eks_node_max_size" {
  type    = number
  default = 10
}

variable "eks_node_desired_size" {
  type    = number
  default = 3
}

# ---------------------------------------------------------------------------
# RDS (PostgreSQL)
# ---------------------------------------------------------------------------
variable "db_engine_version" {
  description = "PostgreSQL engine version for RDS"
  type        = string
  default     = "16.3"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.medium"
}

variable "db_allocated_storage" {
  description = "Initial allocated storage for RDS, in GB"
  type        = number
  default     = 50
}

variable "db_max_allocated_storage" {
  description = "Max storage RDS can autoscale to, in GB"
  type        = number
  default     = 200
}

variable "db_name" {
  description = "Name of the initial database"
  type        = string
  default     = "university_mis"
}

variable "db_username" {
  description = "Master username for RDS"
  type        = string
  default     = "mis_admin"
  sensitive   = true
}

variable "db_multi_az" {
  description = "Whether to deploy RDS in Multi-AZ for high availability"
  type        = bool
  default     = true
}

# ---------------------------------------------------------------------------
# EC2 (bastion / utility instances)
# ---------------------------------------------------------------------------
variable "bastion_instance_type" {
  description = "Instance type for the bastion host used for DB/administrative access"
  type        = string
  default     = "t3.micro"
}

variable "ssh_allowed_cidr" {
  description = "CIDR block allowed to SSH into the bastion host (lock this down!)"
  type        = string
  default     = "0.0.0.0/0" # CHANGE to your office/VPN CIDR before applying
}

# ---------------------------------------------------------------------------
# S3
# ---------------------------------------------------------------------------
variable "s3_bucket_name" {
  description = "Globally-unique name for the application storage bucket"
  type        = string
  default     = "university-mis-storage"
}

# ---------------------------------------------------------------------------
# Tagging
# ---------------------------------------------------------------------------
variable "common_tags" {
  description = "Common tags applied to all resources"
  type        = map(string)
  default = {
    Project   = "University-MIS"
    ManagedBy = "Terraform"
  }
}
