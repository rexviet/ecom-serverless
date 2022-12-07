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

variable "subnet_ids" {
  type = list(string)
}

variable "security_group_ids" {
  type = list(string)
}

variable "payment_created_topic_arn" {
  type = string
}

variable "order_service_internal_api_key" {
  type = string
}

variable "get_order_fnc_name" {
  type = string
}

variable "connect_rds_arn" {
  type = string
}

variable "cdc_payment_created_publish_policy_arn" {
  type = string
}

variable "get_order_invoke_arn" {
  type = string
}
