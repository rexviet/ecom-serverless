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
  }
  required_version = ">= 0.14.9"
}

provider "aws" {
  profile = var.profile
  region  = var.region
}

module "product-service" {
  source = "./services/product"

  master_password   = var.document_db_master_password
  connection_string = var.document_db_connection_string
  rest_api_id       = aws_api_gateway_rest_api.rest_api.id
  root_resource_id  = aws_api_gateway_rest_api.rest_api.root_resource_id
  authorizer_id     = aws_api_gateway_authorizer.api_authorizer.id
}
