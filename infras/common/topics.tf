module "cdc-payment-created" {
  source = "../modules/topic"

  topic_name = "cdc-payment-created"
  fifo_topic = false
  env        = terraform.workspace
  queue_list = {
    order = {
      create_dlq = var.create_dlq
    },
    inventory = {
      create_dlq = var.create_dlq
    },
    invoice = {
      create_dlq = var.create_dlq
    },
  }
}
