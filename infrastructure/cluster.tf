# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_cluster
resource "aws_ecs_cluster" "default" {
  name  = "${var.namespace}_ECSCluster_${var.environment}"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name     = "${var.namespace}_ECSCluster_${var.environment}"
  }
}

## Creates ECS Service

resource "aws_ecs_service" "service" {
  name                               = "${var.namespace}_ECS_Service_${var.environment}"
  iam_role                           = aws_iam_role.ecs_service_role.arn
  cluster                            = aws_ecs_cluster.default.id
  task_definition                    = aws_ecs_task_definition.default.arn
  desired_count                      = var.ecs_task_desired_count
  deployment_minimum_healthy_percent = var.ecs_task_deployment_minimum_healthy_percent
  deployment_maximum_percent         = var.ecs_task_deployment_maximum_percent

  load_balancer {
    target_group_arn = aws_alb_target_group.service_target_group.arn
    container_name   = var.backend_service_name
    container_port   = var.container_backend_port
  }

  ## Spread tasks evenly accross all Availability Zones for High Availability
  ordered_placement_strategy {
    type  = "spread"
    field = "attribute:ecs.availability-zone"
  }

  ## Make use of all available space on the Container Instances
  ordered_placement_strategy {
    type  = "binpack"
    field = "memory"
  }

  ## Do not update desired count again to avoid a reset to this number on every deployment
  lifecycle {
    ignore_changes = [desired_count]
  }
}


# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_task_definition
resource "aws_ecs_task_definition" "default" {
  family             = "${var.namespace}_ECS_TaskDefinition_${var.environment}"
  # https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-cpu-memory-error.html
  # https://github.com/dirt-simple/terraform-aws-fargate-cpu-memory-values
#  cpu                      = 1024
#  memory                   = 2048
  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn      = aws_iam_role.ecs_task_iam_role.arn
#  network_mode = "awsvpc"
  depends_on = [aws_efs_file_system.photos]

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
      name      = var.backend_service_name
      image     = "${aws_ecr_repository.yapper_backend.repository_url}:${var.commit_sha1}"
      cpu       = 512
      memoryReservation = 512
      memory    = 2048
      essential = true
      portMappings = [
        {
          containerPort = var.container_backend_port
          hostPort      = 0
          name          = "web"
          appProtocol   = "http"
        }
      ]
      mountPoints = [
          {
              "containerPath": "/photos",
              "sourceVolume": "photos-volume-efs",
              "readOnly": false
          }
      ]
      logConfiguration = {
        logDriver = "awslogs",
        options   = {
          "awslogs-group"         = aws_cloudwatch_log_group.log_group.name,
          "awslogs-region"        = var.region,
          "awslogs-stream-prefix" = "app"
        }
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
          name  = "POSTGRES_SERVER"
          value = aws_db_instance.main.address
        },
        {
          name  = "USERS_OPEN_REGISTRATION"
          value = "True"
        },
        {
          name  = "PORT"
          value = tostring(var.container_backend_port)
        }
      ]
      secrets = [
        {
          name      = "POSTGRES_JSON_CREDENTIALS"
          valueFrom = aws_db_instance.main.master_user_secret[0].secret_arn
        }
      ]
    }
  ])

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture = "X86_64"
  }
}



resource "aws_ecs_capacity_provider" "cas" {
  name  = "${var.namespace}_ECS_CapacityProvider_${var.environment}"

  auto_scaling_group_provider {
    auto_scaling_group_arn         = aws_autoscaling_group.ecs_autoscaling_group.arn
    managed_termination_protection = "ENABLED"

    managed_scaling {
      maximum_scaling_step_size = var.maximum_scaling_step_size
      minimum_scaling_step_size = var.minimum_scaling_step_size
      status                    = "ENABLED"
      target_capacity           = var.target_capacity
    }
  }
}

resource "aws_ecs_cluster_capacity_providers" "cas" {
  cluster_name       = aws_ecs_cluster.default.name
  capacity_providers = [aws_ecs_capacity_provider.cas.name]
}



## Define Target Tracking on ECS Cluster Task level
resource "aws_appautoscaling_target" "ecs_target" {
  max_capacity       = var.ecs_task_max_count
  min_capacity       = var.ecs_task_min_count
  resource_id        = "service/${aws_ecs_cluster.default.name}/${aws_ecs_service.service.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

## Policy for CPU tracking
resource "aws_appautoscaling_policy" "ecs_cpu_policy" {
  name               = "${var.namespace}_CPUTargetTrackingScaling_${var.environment}"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs_target.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs_target.service_namespace

  target_tracking_scaling_policy_configuration {
    target_value = var.cpu_target_tracking_desired_value

    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
  }
}

## Policy for memory tracking
resource "aws_appautoscaling_policy" "ecs_memory_policy" {
  name               = "${var.namespace}_MemoryTargetTrackingScaling_${var.environment}"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs_target.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs_target.service_namespace

  target_tracking_scaling_policy_configuration {
    target_value = var.memory_target_tracking_desired_value

    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }
  }
}

resource "aws_autoscaling_group" "ecs_autoscaling_group" {
  name                  = "${var.namespace}_ASG_${var.environment}"
  max_size              = var.autoscaling_max_size
  min_size              = var.autoscaling_min_size
  vpc_zone_identifier   = aws_subnet.private.*.id
  health_check_type     = "EC2"
  protect_from_scale_in = true

  enabled_metrics = [
    "GroupMinSize",
    "GroupMaxSize",
    "GroupDesiredCapacity",
    "GroupInServiceInstances",
    "GroupPendingInstances",
    "GroupStandbyInstances",
    "GroupTerminatingInstances",
    "GroupTotalInstances"
  ]

  launch_template {
    id      = aws_launch_template.ecs_backend_launch_template.id
    version = "$Latest"
  }

  instance_refresh {
    strategy = "Rolling"
  }

  lifecycle {
    create_before_destroy = true
  }

  tag {
    key                 = "Name"
    value               = "${var.namespace}_ASG_${var.environment}"
    propagate_at_launch = true
  }
}