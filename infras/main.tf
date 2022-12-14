terraform {
  backend "s3" {
    # Replace this with your bucket name!
    bucket = "ecom-serverless-tf-backend"
    key    = "terraform.tfstate"
    region = "ap-southeast-1"
    # Replace this with your DynamoDB table name!
    dynamodb_table = "ecom-serverless-tf-backend-locks"
    encrypt        = true
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
    random = {
      source  = "hashicorp/random"
      version = "3.4.3"
    }
    null = {
      source  = "hashicorp/null"
      version = "3.2.1"
    }
  }
  required_version = ">= 0.14.9"
}

provider "aws" {
  profile = var.profile
  region  = var.region
}

provider "random" {
  # Configuration options
}

module "common" {
  source = "./common"

  // Network
  vpc_cidr_block              = var.vpc_cidr_block
  subnet_public_cidr_block    = var.subnet_public_cidr_block
  subnet_private_cidr_block   = var.subnet_private_cidr_block
  subnet_private_cidr_block_2 = var.subnet_private_cidr_block_2

  // DocumentDB
  master_password = var.document_db_master_password
}

module "inventory-service" {
  source = "./services/inventory"
  depends_on = [
    module.common,
  ]

  subnet_ids             = module.common.subnet_ids
  security_group_ids     = module.common.security_group_ids
  connect_rds_policy_arn = module.common.connect_rds_arn
  rds_db_host            = module.common.rds_db_host
  rds_db_port            = module.common.rds_db_port
  rds_db_user            = module.common.rds_db_user
  rds_db_name            = module.common.rds_db_name
  queue_arn_mapper       = module.common.cdc-payment-created_q_arn_mapper
}

module "product-service" {
  source = "./services/product"
  depends_on = [
    module.common,
    module.inventory-service,
  ]

  connection_string                  = var.document_db_connection_string
  rest_api_id                        = module.common.rest_api_id
  root_resource_id                   = module.common.root_resource_id
  authorizer_id                      = module.common.authorizer_id
  rest_api_execution_arn             = module.common.rest_api_execution_arn
  increase_quantity_fnc_name         = module.inventory-service.increase_quantity_fnc_name
  inventory_service_internal_api_key = module.inventory-service.internal_api_key
  subnet_ids                         = module.common.subnet_ids
  security_group_ids                 = module.common.security_group_ids
}

module "order-service" {
  source = "./services/order"
  depends_on = [
    module.common,
    module.inventory-service,
  ]
  rest_api_id                        = module.common.rest_api_id
  rest_api_execution_arn             = module.common.rest_api_execution_arn
  root_resource_id                   = module.common.root_resource_id
  authorizer_id                      = module.common.authorizer_id
  inventory_service_internal_api_key = module.inventory-service.internal_api_key
  increase_quantity_fnc_name         = module.inventory-service.increase_quantity_fnc_name
  rds_db_host                        = module.common.rds_db_host
  rds_db_port                        = module.common.rds_db_port
  rds_db_user                        = module.common.rds_db_user
  rds_db_name                        = module.common.rds_db_name
  connect_rds_policy_arn             = module.common.connect_rds_arn
  additional_policies_arn            = [module.common.connect_rds_arn, module.inventory-service.increase_quantity_invoke_arn]
  subnet_ids                         = module.common.subnet_ids
  security_group_ids                 = module.common.security_group_ids
  queue_arn_mapper                   = module.common.cdc-payment-created_q_arn_mapper
}

module "payment-service" {
  source = "./services/payment"
  depends_on = [
    module.common,
  ]
  rest_api_id                            = module.common.rest_api_id
  rest_api_execution_arn                 = module.common.rest_api_execution_arn
  root_resource_id                       = module.common.root_resource_id
  authorizer_id                          = module.common.authorizer_id
  rds_db_host                            = module.common.rds_db_host
  rds_db_port                            = module.common.rds_db_port
  rds_db_user                            = module.common.rds_db_user
  rds_db_name                            = module.common.rds_db_name
  order_service_internal_api_key         = module.order-service.internal_api_key
  get_order_fnc_name                     = module.order-service.get_order_fnc_name
  subnet_ids                             = module.common.subnet_ids
  security_group_ids                     = module.common.security_group_ids
  payment_created_topic_arn              = module.common.cdc-payment-created_arn
  connect_rds_arn                        = module.common.connect_rds_arn
  cdc_payment_created_publish_policy_arn = module.common.cdc-payment-created_publish_policy_arn
  get_order_invoke_arn                   = module.order-service.get_order_invoke_arn
}

module "invoice-service" {
  source = "./services/invoice"
  depends_on = [
    module.common,
  ]
  subnet_ids          = module.common.subnet_ids
  security_group_ids  = module.common.security_group_ids
  queue_arn_mapper    = module.common.cdc-payment-created_q_arn_mapper
  invoice_bucket_name = module.common.invoice_bucket_name
  invoice_bucket_arn  = module.common.invoice_bucket_arn
  s3_put_policy_arn   = module.common.s3_put_policy_arn
}

module "notification-service" {
  source = "./services/notification"
  depends_on = [
    module.common,
  ]

  subnet_ids                     = module.common.subnet_ids
  security_group_ids             = module.common.security_group_ids
  invoice_bucket_name            = module.common.invoice_bucket_name
  invoice_bucket_arn             = module.common.invoice_bucket_arn
  order_service_internal_api_key = module.order-service.internal_api_key
  get_order_fnc_name             = module.order-service.get_order_fnc_name
  get_order_invoke_arn           = module.order-service.get_order_invoke_arn
  s3_get_object_policy_arn       = module.common.s3_get_object_policy_arn
  mailjet_api_key                = var.mailjet_api_key
  mailjet_api_secret             = var.mailjet_api_secret
  system_email                   = var.system_email
}
