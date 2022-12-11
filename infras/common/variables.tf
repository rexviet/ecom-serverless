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

variable "project" {
  type    = string
  default = "ecom"
}

/***** Start NETWORK REGION *****/
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
/****** End NETWORK REGION ******/

/***** Start DocumentDB REGION *****/
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
/****** End DocumentDB REGION ******/

/***** Start Topics REGION *****/
variable "create_dlq" {
  type    = bool
  default = false
}
/****** End Topics REGION ******/
