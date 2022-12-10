variable "get_order_fnc_name" {
  type = string
}

variable "order_service_internal_api_key" {
  type = string
}

variable "get_order_invoke_arn" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
}

variable "security_group_ids" {
  type = list(string)
}

variable "invoice_bucket_name" {
  type = string
}

variable "invoice_bucket_arn" {
  type = string
}

variable "s3_get_object_policy_arn" {
  type = string
}

variable "mailjet_api_key" {
  type = string
}

variable "mailjet_api_secret" {
  type = string
}

variable "system_email" {
  type = string
}
