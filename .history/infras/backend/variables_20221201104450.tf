/***** Start NOT EDIT REGION *****/
variable "env_prefix" {
  type    = string
  default = "dev"
}

variable "profile" {
  type        = string
  description = "AWS profile to use"
}

variable "region" {
  type        = string
  description = "AWS region create resources"
}
/****** End NOT EDIT REGION ******/
