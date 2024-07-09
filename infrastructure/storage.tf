# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/efs_file_system
resource "aws_efs_mount_target" "alpha" {
  count = length(aws_subnet.private)
  file_system_id = aws_efs_file_system.photos.id
  subnet_id      = aws_subnet.private[count.index].id
  security_groups = [aws_security_group.efs_photos.id]
}

resource "aws_efs_file_system" "photos" {
  tags = {
    Name = "${var.namespace}_photos_${var.environment}"
  }
}
