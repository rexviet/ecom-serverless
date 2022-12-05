





variable "connection_string" {
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

variable "rest_api_execution_arn" {
  type = string
}

# variable "inventory_service_path" {
#   type = string
# }
variable "inventory_service_internal_api_key" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
}

variable "security_group_ids" {
  type = list(string)
}
