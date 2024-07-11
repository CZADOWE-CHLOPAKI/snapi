terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.57"
    }
  }

  required_version = ">= 1.9.0"
}

provider "aws" {
  region = "eu-central-1"
}


# https://nexgeneerz.io/aws-computing-with-ecs-ec2-terraform/#Bastion_Host
# https://spacelift.io/blog/terraform-ecs
# https://stackoverflow.com/questions/49743220/how-to-create-an-ssh-key-in-terraform
# https://aws.amazon.com/tutorials/ec2-auto-scaling-spot-instances/
# https://medium.com/@ilia.lazebnik/attaching-an-efs-file-system-to-an-ecs-task-7bd15b76a6ef
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/efs_mount_target
# https://stackoverflow.com/questions/51273227/whats-the-most-efficient-way-to-determine-the-minimum-aws-permissions-necessary


# https://stackoverflow.com/questions/32824388/postgresql-remotely-connecting-to-postgres-instance-using-psql-command
# sudo amazon-linux-extras install postgresql10

# psql -h terraform-20240710174425270900000007.chu0u6w4u2a9.eu-central-1.rds.amazonaws.com -p 5432 -d postgres -U postgres -W
# G.mU)Rb0?V*FfzU5fPa.th|jHHzU

# https://github.com/tiangolo/fastapi/discussions/9328
