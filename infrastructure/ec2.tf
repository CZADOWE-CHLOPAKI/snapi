## Get most recent AMI for an ECS-optimized Amazon Linux 2 instance
data "aws_ami" "amazon_linux_2" {
  most_recent = true

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  filter {
    name   = "owner-alias"
    values = ["amazon"]
  }

  filter {
    name   = "name"
    values = ["amzn2-ami-ecs-hvm-*-x86_64-ebs"]
  }

  owners = ["amazon"]
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/launch_template
resource "aws_launch_template" "ecs_backend_launch_template" {
  name          = "${var.namespace}_EC2_LaunchTemplate_backend_${var.environment}"
  image_id      = data.aws_ami.amazon_linux_2.id
  instance_type = var.instance_type

  key_name               = "stacjonarny-linux"
  vpc_security_group_ids = [aws_security_group.ec2.id]

  user_data = base64encode(data.template_file.user_data.rendered)

  iam_instance_profile {
    arn = aws_iam_instance_profile.ec2_instance_role_profile.arn
  }

#  block_device_mappings {
#    device_name = "/dev/xvda"
#    ebs {
#      volume_size = 30
#      volume_type = "gp2"
#    }
#  }
#
#  tag_specifications {
#    resource_type = "instance"
#    tags          = {
#      Name = "ecs-instance"
#    }
#  }

  monitoring {
    enabled = true
  }
}


data "template_file" "user_data" {
  template = file("${path.module}/scripts/ecs.sh")

  vars = {
    ecs_cluster_name = aws_ecs_cluster.default.name
  }
}

