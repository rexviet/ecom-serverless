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

module "product-service" {
  source = "./services/product"

  master_password                    = var.document_db_master_password
  connection_string                  = var.document_db_connection_string
  rest_api_id                        = aws_api_gateway_rest_api.rest_api.id
  root_resource_id                   = aws_api_gateway_rest_api.rest_api.root_resource_id
  authorizer_id                      = aws_api_gateway_authorizer.api_authorizer.id
  rest_api_execution_arn             = aws_api_gateway_rest_api.rest_api.execution_arn
  inventory_service_internal_api_key = module.inventory-service.internal_api_key
}

module "inventory-service" {
  source                = "./services/inventory"
  db_password           = "Viet1234"
  rest_api_id           = aws_api_gateway_rest_api.rest_api.id
  root_resource_id      = aws_api_gateway_rest_api.rest_api.root_resource_id
  res_api_execution_arn = aws_api_gateway_rest_api.rest_api.execution_arn
}
