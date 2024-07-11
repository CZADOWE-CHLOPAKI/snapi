# create aws_db_instance with these options: aurora postgresql compatible, small storage, no backup retention, no monitoring, no multi-az, public access, craete proper sg, no parameter group, subnet as the rest, no tags, no final snapshot, auth stord in kms, no enhanced monitoring, no performance insights, no deletion protection

resource "aws_db_subnet_group" "default" {
  name       = "${var.namespace}_db_subnet_${var.environment}"
  subnet_ids = aws_subnet.private[*].id

  tags       = {
    Name = "${var.namespace}_db_subnet_${var.environment}"
  }
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/db_instance
resource "aws_db_instance" "main" {
  allocated_storage       = 20
  max_allocated_storage   = 30
  storage_type            = "gp2"
  db_name                 = "postgres"
  engine                  = "postgres"
  engine_version          = "16.3"
  instance_class          = "db.t3.micro"
  deletion_protection     = false
  publicly_accessible     = true
  backup_retention_period = 2
  skip_final_snapshot     = true

  # network
  multi_az               = true
  db_subnet_group_name   = aws_db_subnet_group.default.name
  vpc_security_group_ids = [aws_security_group.db.id, aws_security_group.ec2.id]

  # login
  username                    = "postgres"
  manage_master_user_password = true


  tags = {
    Name = "${var.namespace}_InternetGateway_${var.environment}"
  }
}