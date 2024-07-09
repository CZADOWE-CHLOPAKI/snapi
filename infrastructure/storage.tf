# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/efs_file_system
resource "aws_efs_file_system" "photos" {
  tags = {
    Name = "Yapper photos"
  }
}
