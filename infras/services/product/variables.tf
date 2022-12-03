variable "cluster_identifier" {
  type    = string
  default = "ecom-cluster"
}

variable "master_username" {
  type    = string
  default = "root"
}

variable "master_password" {
  type = string
}

variable "instance_class" {
  type    = string
  default = "db.t3.medium"
}

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
