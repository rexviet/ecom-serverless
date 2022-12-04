variable "layers" {
  type = list(string)
}

variable "function_name" {
  type = string
}

variable "source_dir" {
  type = string
}

variable "output_path" {
  type = string
}

variable "env_prefix" {
  type = string
}

variable "env" {
  type = map(any)
}

variable "timeout" {
  type    = number
  default = 3
}

variable "subnet_ids" {
  type = list(string)
}

variable "security_group_ids" {
  type = list(string)
}

variable "policies_arn" {
  type    = list(string)
  default = []
}

variable "invoke_principle" {
  type    = string
  default = ""
}

variable "invoke_src_arn" {
  type    = string
  default = ""
}
