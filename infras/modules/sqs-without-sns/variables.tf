variable "q_name" {
  type        = string
  description = "Name of the SQS queue"
}

variable "tags" {
  type        = map(string)
  description = "Tags to set on the queue."
  default     = {}
}

variable "retry" {
  type        = number
  description = "Number retries of queue."
  default     = 10
}

variable "create_dlq" {
  type        = bool
  description = "Flag to create deadletter queue or not"
}

variable "fifo_queue" {
  type        = bool
  description = "Flag to create a queue as FIFO or normal"
  default     = false
}
