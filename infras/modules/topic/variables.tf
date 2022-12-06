variable "env" {
  type = string
}

variable "fifo_topic" {
  type        = bool
  description = "Flag to create a topic as FIFO or normal"
}

variable "topic_name" {
  type = string
}

variable "queue_list" {
  type = map(object({
    create_dlq = bool
  }))
}
