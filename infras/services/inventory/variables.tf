variable "subnet_ids" {
  type = list(string)
}

variable "security_group_ids" {
  type = list(string)
}

variable "connect_rds_policy_arn" {
  type = string
}

variable "rds_db_host" {
  type = string
}

variable "rds_db_port" {
  type = number
}

variable "rds_db_user" {
  type = string
}

variable "rds_db_name" {
  type = string
}
