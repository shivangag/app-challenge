resource "aws_cloudwatch_log_group" "ecs-logs" {
  name = "/aws/ecs/-${var.app_name}-ecs-logs"
}

resource "aws_cloudwatch_log_stream" "ecs-logs-logstream" {
  name           = "ecs-backend"
  log_group_name =  "${aws_cloudwatch_log_group.ecs-logs.name}"
}