variable "region" {
  type        = string
  description = "AWS region create resources"
  default     = "ap-southeast-1"
}

variable "db_port" {
  type    = number
  default = 5432
}

variable "db_password" {
  type = string
}

variable "rest_api_id" {
  type = string
}

variable "root_resource_id" {
  type = string
}

variable "res_api_execution_arn" {
  type = string
}
