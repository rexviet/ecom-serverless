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
