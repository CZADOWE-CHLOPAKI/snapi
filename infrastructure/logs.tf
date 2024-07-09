
## Create log group for our service
resource "aws_cloudwatch_log_group" "log_group" {
  name              = "/${lower(var.namespace)}/ecs/${var.backend_service_name}"
  retention_in_days = var.log_retention_days
}