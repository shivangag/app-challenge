provider "aws" {
  region = var.region
}

data "aws_availability_zones" "available" {}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "2.77.0"

  name                 = "app-challenge"
  cidr                 = "10.0.0.0/16"
  azs                  = data.aws_availability_zones.available.names
  public_subnets       = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
  enable_dns_hostnames = true
  enable_dns_support   = true
}

resource "random_password" "master_password" {
  length  = 16
  special = false
}

resource "aws_db_subnet_group" "app-challenge" {
  name       = "app-challenge"
  subnet_ids = module.vpc.public_subnets

  tags = {
    Name = "app-challenge"
  }
}

resource "aws_security_group" "rds" {
  name   = "app-challenge-rds"
  vpc_id = module.vpc.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "app-challenge-rds"
  }
}

resource "aws_db_parameter_group" "app-challenge" {
  name   = "app-challenge"
  family = "postgres12"

  parameter {
    name  = "log_connections"
    value = "1"
  }
}

resource "aws_db_instance" "app-challenge" {
  identifier             = "app-challenge"
  instance_class         = "db.t2.micro"
  allocated_storage      = 5
  engine                 = "postgres"
  engine_version         = "12.8"
  username               = "appuser"
  password               = random_password.master_password.result
  db_subnet_group_name   = aws_db_subnet_group.app-challenge.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  parameter_group_name   = aws_db_parameter_group.app-challenge.name
  publicly_accessible    = true
  skip_final_snapshot    = true
}

resource "aws_secretsmanager_secret" "rds_credentials" {
  name = "DB_PASS"
}

resource "aws_secretsmanager_secret_version" "rds_credentials" {
  secret_id     = aws_secretsmanager_secret.rds_credentials.id
  secret_string = "${random_password.master_password.result}"
}

resource "aws_secretsmanager_secret" "jwt-secret" {
  name = "JWTKEY"
  description = "JWTKEY"
}

resource "aws_secretsmanager_secret_version" "jwt-secret" {
  secret_id     = "${aws_secretsmanager_secret.jwt-secret.id}"
  secret_string = "${var.jwt_secret}"
}

resource "aws_elasticache_subnet_group" "app-challenge-redis" {
  name       = "app-challenge-redis"
  subnet_ids = module.vpc.public_subnets

  tags = {
    Name = "app-challenge-redis"
  }
}

resource "aws_security_group" "redis" {
  name   = "app-challenge-redis"
  vpc_id = module.vpc.vpc_id
 
  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "app-challenge-redis"
  }
}

resource "aws_elasticache_cluster" "redis_cluster" {
  cluster_id           = "${var.app_name}-redis"
  engine               = "redis"
  node_type            = "cache.t2.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis5.0"
  engine_version       = "5.0.6"
  port                 = 6379
  security_group_ids   = [aws_security_group.redis.id]
  subnet_group_name    = aws_elasticache_subnet_group.app-challenge-redis.name
}
