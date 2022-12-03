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

variable "project" {
  type    = string
  default = "ecom"
}
variable "vpc_cidr_block" {
  type        = string
  description = "VPC CIDR"
}

variable "subnet_public_cidr_block" {
  type        = string
  description = "Public subnet CIDR"
}

variable "subnet_private_cidr_block" {
  type        = string
  description = "Private subnet CIDR"
}

variable "subnet_private_cidr_block_2" {
  type        = string
  description = "Private subnet 2 CIDR"
}
