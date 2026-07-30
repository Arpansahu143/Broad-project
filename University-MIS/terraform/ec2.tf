# =============================================================================
# University MIS - EC2 (Bastion Host)
# A hardened, minimal bastion in a public subnet for administrative access
# to private-subnet resources (RDS migrations, cluster debugging, etc.).
# Prefer AWS Systems Manager Session Manager over SSH where possible.
# =============================================================================

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_iam_role" "bastion" {
  name = "${var.project_name}-bastion-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })

  tags = var.common_tags
}

# Enables AWS Systems Manager Session Manager - SSH-less, audited shell access
resource "aws_iam_role_policy_attachment" "bastion_ssm" {
  role       = aws_iam_role.bastion.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "bastion" {
  name = "${var.project_name}-bastion-profile"
  role = aws_iam_role.bastion.name
}

resource "aws_instance" "bastion" {
  ami                         = data.aws_ami.amazon_linux.id
  instance_type               = var.bastion_instance_type
  subnet_id                   = aws_subnet.public[0].id
  vpc_security_group_ids      = [aws_security_group.bastion.id]
  iam_instance_profile        = aws_iam_instance_profile.bastion.name
  associate_public_ip_address = true

  metadata_options {
    http_tokens                = "required" # enforce IMDSv2
    http_put_response_hop_limit = 1
  }

  root_block_device {
    volume_size           = 20
    volume_type            = "gp3"
    encrypted              = true
    delete_on_termination  = true
  }

  user_data = <<-EOF
    #!/bin/bash
    set -euxo pipefail
    dnf update -y
    dnf install -y postgresql16 amazon-cloudwatch-agent
  EOF

  tags = merge(var.common_tags, { Name = "${var.project_name}-bastion" })
}
