/***** Start NOT EDIT REGION *****/
variable "env_prefix" {
  type    = string
  default = "dev"
}

variable "profile" {
  type        = string
  description = "AWS profile to use"
  default     = "default"
}

variable "region" {
  type        = string
  description = "AWS region create resources"
  default     = "ap-southeast-1"
}
/****** End NOT EDIT REGION ******/

variable "document_db_master_password" {
  type = string
}

variable "document_db_connection_string" {
  type = string
}
