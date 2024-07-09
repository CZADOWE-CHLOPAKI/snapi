## SG for EC2 instances

resource "aws_security_group" "ec2" {
  name        = "${var.namespace}_EC2_Instance_SecurityGroup_${var.environment}"
  description = "Security group for EC2 instances in ECS cluster"
  vpc_id      = aws_vpc.default.id

  ingress {
    description     = "Allow ingress traffic from ALB on HTTP on ephemeral ports"
    from_port       = 1024
    to_port         = 65535
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  ingress {
    description     = "Allow SSH ingress traffic from bastion host"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion_host.id]
  }

  egress {
    description = "Allow all egress traffic"
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name     = "${var.namespace}_EC2_Instance_SecurityGroup_${var.environment}"
  }
}

resource "aws_security_group" "efs_photos" {
  name       = "${var.namespace}_EFS_Photos_SecurityGroup_${var.environment}"
  vpc_id     = aws_vpc.default.id

  ingress {
    description     = "Allow ingress traffic from EC2 instances"
    from_port       = 2049
    to_port         = 2049
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2.id]
  }

  egress {
    description = "Allow all egress traffic"
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
      Name     = "${var.namespace}_EFS_Photos_SecurityGroup_${var.environment}"
  }
}

## SG for ALB

resource "aws_security_group" "alb" {
  name        = "${var.namespace}_ALB_SecurityGroup_${var.environment}"
  description = "Security group for ALB"
  vpc_id      = aws_vpc.default.id

  egress {
    description = "Allow all egress traffic"
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name     = "${var.namespace}_ALB_SecurityGroup_${var.environment}"
  }
}

data "aws_ec2_managed_prefix_list" "cloudfront" {
  name = "com.amazonaws.global.cloudfront.origin-facing"
}

## We only allow incoming traffic on HTTP and HTTPS from known CloudFront CIDR blocks
resource "aws_security_group_rule" "alb_cloudfront_https_ingress_only" {
  security_group_id = aws_security_group.alb.id
  description       = "Allow HTTPS access only from CloudFront CIDR blocks"
  from_port         = 443
  protocol          = "tcp"
  prefix_list_ids   = [data.aws_ec2_managed_prefix_list.cloudfront.id]
  to_port           = 443
  type              = "ingress"
}

resource "aws_security_group" "bastion_host" {
  name        = "${var.namespace}_SecurityGroup_BastionHost_${var.environment}"
  description = "Bastion host Security Group"
  vpc_id      = aws_vpc.default.id

  ingress {
    description = "Allow SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] ## The IP range could be limited to the developers IP addresses if they are fix
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "bastion_host" {
  ami                         = data.aws_ami.amazon_linux_2.id
  instance_type               = "t3.micro"
  subnet_id                   = aws_subnet.public[0].id
  associate_public_ip_address = true
  key_name                    = "stacjonarny-linux"
  vpc_security_group_ids      = [aws_security_group.bastion_host.id]

  tags = {
    Name     = "${var.namespace}_EC2_BastionHost_${var.environment}"
  }
}