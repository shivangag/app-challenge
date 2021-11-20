module "acm" {
  source  = "terraform-aws-modules/acm/aws"
  version = "~> 3.0"

  domain_name  = "${var.domain_name}"
  zone_id      = "${var.domain_route53_zone}"

  subject_alternative_names = [
    "${var.subject_alternative_name}"
  ]

  wait_for_validation = true

  tags = {
    Name = "${var.domain_name}"
  }
}