variable "invoice_bucket_name" {
  type = string
}

variable "invoice_bucket_arn" {
  type = string
}

variable "queue_arn_mapper" {
  type = map(string)
}

variable "subnet_ids" {
  type = list(string)
}

variable "security_group_ids" {
  type = list(string)
}

variable "s3_put_policy_arn" {
  type = string
}
