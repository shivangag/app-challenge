variable "region" {
  default     = "eu-west-1"
  description = "AWS region"
}

variable "app_name" {
  default     = "app-challenge"
  description = "App Name"
}
variable "jwt_secret" {
  default     = "jwtsecretvalue"
  description = "jwt secret for backend"
  sensitive   = true
}

variable "container_port" {
  default     = 3001
  description = "Port of Nodejs Container"
  sensitive   = false
}

variable "client_url" {
  default     = "https://app.biedka.com"
  description = "Frontend Client APP URL"
  sensitive   = false
}

variable "container_image" {
  default     = "486170363143.dkr.ecr.eu-west-1.amazonaws.com/app-challenge-repo:latest"
  description = "Nodejs Container Image"
  sensitive   = false
}

variable "domain_name" {
  default     = "biedka.com"
  description = "Domain Name"
}

variable "subject_alternative_name" {
  default     = "api-app-challenge.biedka.com"
  description = "Subdomain names"
}

variable "domain_route53_zone" {
  default     = "Z08954351DKY1BODMLLJG"
  description = "Route53 Zone"
}

variable "sentry_url" {
  default     = "https://4e98de50242247eebc5512b55bc558a3@sentry.io/1837145"
  description = "sentry"
}

variable "database_name" {
  default     = "app_challenge_db"
  description = "database name"
}
