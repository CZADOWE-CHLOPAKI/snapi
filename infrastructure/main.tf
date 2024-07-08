terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "eu-central-1"
}


resource "aws_vpc" "yapper_main" {
 cidr_block           = "10.10.0.0/16"
 enable_dns_hostnames = true
 tags = {
   name = "main"
 }
}

resource "aws_subnet" "yapper_subnet_a" {
 vpc_id                  = aws_vpc.yapper_main.id
 cidr_block              = cidrsubnet(aws_vpc.yapper_main.cidr_block, 8, 1)
 map_public_ip_on_launch = true
 availability_zone       = "eu-central-1a"
}

resource "aws_subnet" "yapper_subnet_b" {
 vpc_id                  = aws_vpc.yapper_main.id
 cidr_block              = cidrsubnet(aws_vpc.yapper_main.cidr_block, 8, 2)
 map_public_ip_on_launch = true
 availability_zone       = "eu-central-1b"
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecr_repository
resource "aws_ecr_repository" "yapper_backend" {
  name                 = "yapper-backend"
  image_tag_mutability = "MUTABLE"
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/efs_file_system
resource "aws_efs_file_system" "photos" {
  tags = {
    Name = "Yapper photos"
  }
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role
resource "aws_iam_role" "yapper_backend_execution_role" {
  name = "yapper_backend_execution_role"
  assume_role_policy = jsonencode({
    Version: "2008-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.yapper_backend_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "secrets_manager_read_write" {
  role       = aws_iam_role.yapper_backend_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/SecretsManagerReadWrite"
}


# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_task_definition
resource "aws_ecs_task_definition" "ecs_yapper_backend" {
  family = "yapper-backend"
  requires_compatibilities = ["FARGATE"]
  # https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-cpu-memory-error.html
  # https://github.com/dirt-simple/terraform-aws-fargate-cpu-memory-values
  cpu                      = 1024
  memory                   = 2048
  execution_role_arn = aws_iam_role.yapper_backend_execution_role.arn
  task_role_arn      = aws_iam_role.yapper_backend_execution_role.arn
  network_mode = "awsvpc"
  volume {
    name = "photos-volume-efs"

    efs_volume_configuration {
      file_system_id = aws_efs_file_system.photos.id
      root_directory = "/"
      transit_encryption = "DISABLED"
    }
  }
  # https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_ContainerDefinition.html
  container_definitions = jsonencode([
    {
      name      = "yapper-backend"
      image     = aws_ecr_repository.yapper_backend.repository_url
      cpu       = 512
      memoryReservation = 1024
      memory    = 2048
      essential = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
          name          = "web"
          appProtocol   = "http"
        }
      ]
      mountPoints = [
          {
              "containerPath": "/photos",
              "sourceVolume": "photos-volume-efs"
          }
      ]
      logConfiguration: {
        logDriver: "awslogs"
        options: {
            "awslogs-group": "/ecs/snapi"
            "awslogs-create-group": "true"
            "awslogs-region": "eu-central-1"
            "awslogs-stream-prefix": "ecs"
        }
        secretOptions: []
      }
      environment = [
        {
          name  = "FILE_STORAGE_PATH"
          value = "/photos"
        },
        {
          name  = "FIRST_SUPERUSER"
          value = "admin@snapi.com"
        },
        {
          name  = "FIRST_SUPERUSER_PASSWORD"
          value = "upt5LU0KbNF9QQV1Nnxz9"
        },
        {
          name  = "POSTGRES_DB"
          value = "app"
        },
        {
          name  = "POSTGRES_JSON_CREDENTIALS"
          value = "tutaj arn"
        },
        {
          name  = "POSTGRES_SERVER"
          value = "TODO tutaj url do bazy"
        },
        {
          name  = "USERS_OPEN_REGISTRATION"
          value = "True"
        }
      ]
    }
  ])

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture = "X86_64"
  }
}