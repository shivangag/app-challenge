locals {

  region      = var.region
  log_group   = "${aws_cloudwatch_log_group.ecs-logs.name}"
}

resource "aws_security_group" "alb" {
  name   = "${var.app_name}-alb-sgrp"
  vpc_id = module.vpc.vpc_id
 
  ingress {
   protocol         = "tcp"
   from_port        = 80
   to_port          = 80
   cidr_blocks      = ["0.0.0.0/0"]
   ipv6_cidr_blocks = ["::/0"]
  }
 
  ingress {
   protocol         = "tcp"
   from_port        = 443
   to_port          = 443
   cidr_blocks      = ["0.0.0.0/0"]
   ipv6_cidr_blocks = ["::/0"]
  }
 
  egress {
   protocol         = "-1"
   from_port        = 0
   to_port          = 0
   cidr_blocks      = ["0.0.0.0/0"]
   ipv6_cidr_blocks = ["::/0"]
  }
}

resource "aws_security_group" "ecs_tasks" {
  name   = "${var.app_name}-ecs-sgrp"
  vpc_id = module.vpc.vpc_id
 
  ingress {
   protocol         = "tcp"
   from_port        = var.container_port
   to_port          = var.container_port
   cidr_blocks      = ["0.0.0.0/0"]
   ipv6_cidr_blocks = ["::/0"]
  }
 
  egress {
   protocol         = "-1"
   from_port        = 0
   to_port          = 0
   cidr_blocks      = ["0.0.0.0/0"]
   ipv6_cidr_blocks = ["::/0"]
  }
}

resource "aws_ecs_cluster" "main" {
  name = "${var.app_name}"
}

resource "aws_ecs_task_definition" "ecs_task_definition" {
  family                   = "service"
  task_role_arn            = "${aws_iam_role.ecs_task_role.arn}"
  execution_role_arn       = "${aws_iam_role.ecs_task_execution_role.arn}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  container_definitions = <<DEFINITION
[
  {
    "logConfiguration": {
          "logDriver": "awslogs",
          "options": {
            "awslogs-group": "${local.log_group}",
            "awslogs-region": "${local.region}",
            "awslogs-stream-prefix": "/aws/ecs"
          }
        },
    "cpu":0,
	"environment": [
                {
                    "value": "${aws_db_instance.app-challenge.address}",
                    "name": "DB_HOST"
                },
				{
                    "value": "${aws_db_instance.app-challenge.port}",
                    "name": "DB_PORT"
                },
				{
                    "value": "${aws_db_instance.app-challenge.username}",
                    "name": "DB_USER"
                },
				{
                    "value": "postgres",
                    "name": "DB_DIALECT"
                },
				{
                    "value": "app_challenge_db",
                    "name": "DB_NAME_PRODUCTION"
                },
				{
                    "value": "jwtToken",
                    "name": "TOKEN"
                },
				{
                    "value": "144h",
                    "name": "TOKEN_EXPIRATION"
                },
				{
                    "value": "Bearer",
                    "name": "BEARER"
                },
				{
                    "value": "${var.client_url}",
                    "name": "CLIENT_URL"
                },
				{
                    "value": "${var.sentry_url}",
                    "name": "SENTRY_DSN"
                },
				{
                    "value": "${var.database_name}",
                    "name": "DB_NAME_DEVELOPMENT"
                },
				{
                    "value": "${var.database_name}",
                    "name": "DB_NAME_TEST"
                },
				{
                    "value": "${var.redis_host}",
                    "name": "REDIS_HOST"
                },
				{
                    "value": "${var.redis_port}",
                    "name": "REDIS_PORT"
                }
            ],
	"secrets": [
			{
			        "valueFrom": "${aws_secretsmanager_secret_version.rds_credentials.arn}",
                    "name": "DB_PASS"
			},
      			{
			        "valueFrom": "${aws_secretsmanager_secret_version.jwt-secret.arn}",
                    "name": "JWTKEY"
			}
	
	],
    "dnsSearchDomains":[],
    "dnsServers":[],
    "dockerLabels":{},
    "dockerSecurityOptions":[],
    "essential":true,
    "extraHosts":[],
    "image": "${var.container_image}",
    "links":[],
    "mountPoints":[],
    "name": "fargate-app",
    "portMappings":[
      {
        "containerPort": ${var.container_port},
        "hostPort": ${var.container_port},
        "protocol": "tcp"
      }
    ],
    "ulimits":[],
    "volumesFrom":[]
  }
]
DEFINITION
}

resource "aws_iam_role" "ecs_task_role" {
  name = "ecsTaskRole"
  assume_role_policy = <<EOF
{
 "Version": "2012-10-17",
 "Statement": [
   {
     "Action": "sts:AssumeRole",
     "Principal": {
       "Service": "ecs-tasks.amazonaws.com"
     },
     "Effect": "Allow",
     "Sid": ""
   }
 ]
}
EOF
}
 
resource "aws_iam_policy" "secretsmanager" {
  name        = "task-policy-secretsmanager"
  description = "Policy that allows access to secretsmanager"
 
 policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "secretsmanager:*",
            "Resource": "*"
        }
    ]
}
EOF
}
 
resource "aws_iam_role_policy_attachment" "ecs-task-role-policy-attachment" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.secretsmanager.arn
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"
 
  assume_role_policy = <<EOF
{
 "Version": "2012-10-17",
 "Statement": [
   {
     "Action": "sts:AssumeRole",
     "Principal": {
       "Service": "ecs-tasks.amazonaws.com"
     },
     "Effect": "Allow",
     "Sid": ""
   }
 ]
}
EOF
}
 
resource "aws_iam_role_policy_attachment" "ecs-task-execution-role-policy-attachment" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "ecs-task-execution-role-attachment-secretsmanager" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.secretsmanager.arn
}

resource "aws_ecs_service" "main" {
 name                               = "${var.app_name}-service"
 cluster                            = aws_ecs_cluster.main.id
 task_definition                    = aws_ecs_task_definition.ecs_task_definition.arn
 desired_count                      = 1
 deployment_minimum_healthy_percent = 50
 deployment_maximum_percent         = 200
 launch_type                        = "FARGATE"
 scheduling_strategy                = "REPLICA"
 
 network_configuration {
   security_groups  = [aws_security_group.ecs_tasks.id]
   subnets          = module.vpc.public_subnets
   assign_public_ip = true
 }
 
 load_balancer {
   target_group_arn = aws_alb_target_group.main.id
   container_name   = "fargate-app"
   container_port   = var.container_port
 }
 
 lifecycle {
   ignore_changes = [desired_count]
 }
}