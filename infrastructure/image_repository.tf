# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecr_repository
resource "aws_ecr_repository" "yapper_backend" {
  name                 = "yapper-backend"
  image_tag_mutability = "MUTABLE"
}
