variable "region" {
  type        = string
  description = "AWS region create resources"
  default     = "ap-southeast-1"
}

variable "rest_api_execution_arn" {
  type = string
}

variable "rest_api_id" {
  type = string
}

variable "root_resource_id" {
  type = string
}

variable "authorizer_id" {
  type = string
}

variable "rds_db_host" {
  type = string
}

variable "rds_db_port" {
  type    = number
  default = 27017
}

variable "rds_db_user" {
  type = string
}

variable "rds_db_name" {
  type = string
}

variable "additional_policies_arn" {
  type = list(string)
}

variable "subnet_ids" {
  type = list(string)
}

variable "security_group_ids" {
  type = list(string)
}

variable "payment_created_topic_arn" {
  type = string
}
