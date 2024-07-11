# TODO sort variables

variable "namespace" {
  description = "namespace for the infrastructure"
  type        = string
  default     = "yapper"
}
variable "environment" {
  description = "environment for the infrastructure"
  type        = string
  default     = "dev"
}

variable "az_count" {
  description = "Number of availability zones"
  type        = number
  default     = 2
}

variable "container_backend_port" {
  description = "Port of backend containers"
  type        = number
  default     = 8080
}

variable "vpc_cidr_block" {
    description = "CIDR block for the VPC"
    type        = string
    default     = "10.10.0.0/16"
}

variable "instance_type" {
    description = "Instance type for the EC2 instance"
    type        = string
    default     = "t3.small"
}

variable "commit_sha1" {
  description = "Last commit sha1"
  type        = string
  default = "latest"
}

variable "region" {
    description = "AWS region"
    type        = string
    default     = "eu-central-1"
}

variable "log_retention_days" {
    description = "Log retention days"
    type        = number
    default     = 7
}

variable "backend_service_name" {
    description = "Name of the backend service"
    type        = string
    default     = "yapper_backend"
}

variable "maximum_scaling_step_size" {
    description = "Maximum scaling step size"
    type        = number
    default     = 1
}

variable "minimum_scaling_step_size" {
    description = "Minimum scaling step size"
    type        = number
    default     = 1
}

variable "target_capacity" {
    description = "Target capacity"
    type        = number
    default     = 2
}

variable "ecs_task_max_count" {
    description = "Maximum number of ECS tasks"
    type        = number
    default     = 2
}

variable "ecs_task_min_count" {
    description = "Minimum number of ECS tasks"
    type        = number
    default     = 1
}

variable "cpu_target_tracking_desired_value" {
    description = "CPU target tracking desired value"
    type        = number
    default     = 50
}

variable "memory_target_tracking_desired_value" {
    description = "Memory target tracking desired value"
    type        = number
    default     = 50
}

variable "autoscaling_max_size" {
    description = "Maximum size of the autoscaling group"
    type        = number
    default     = 2
}

variable "autoscaling_min_size" {
    description = "Minimum size of the autoscaling group"
    type        = number
    default     = 1
}

variable "certificate_arn" {
    description = "Certificate ARN"
    type        = string
    default     = "arn:aws:acm:eu-central-1:972830530698:certificate/96a3f9da-6edc-4d2b-994c-5da9439569d6"
}

variable "domain_name" {
    description = "Domain name"
    type        = string
    default     = "maciej-szok.dev"
}

variable "ecs_task_desired_count" {
    description = "Desired number of ECS tasks"
    type        = number
    default     = 1
}

variable "ecs_task_deployment_minimum_healthy_percent"{
    description = "Minimum healthy percent for ECS task deployment"
    type        = number
    default     = 0
}

variable "ecs_task_deployment_maximum_percent" {
    description = "Maximum percent for ECS task deployment"
    type        = number
    default     = 100
}