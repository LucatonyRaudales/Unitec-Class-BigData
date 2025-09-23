variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "domain_name" {
  description = "Domain name for the certificate"
  type        = string
}

variable "hosted_zone_id" {
  description = "Route53 hosted zone ID"
  type        = string
}
