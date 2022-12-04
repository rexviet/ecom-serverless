data "aws_caller_identity" "current" {}
locals {
  account_id = data.aws_caller_identity.current.account_id
}

module "fnc-get-inven-by-sku" {
  source = "../../resources/lambda"

  layers        = [aws_lambda_layer_version.inventory_common_layer.arn]
  env_prefix    = terraform.workspace
  function_name = "get-inven-by-sku"
  source_dir    = "../services/inventory/dist/get-inventory-by-sku"
  output_path   = "../archived/inventory/get-inventory-by-sku.zip"
  depends_on = [
    aws_lambda_layer_version.inventory_common_layer
  ]
  env = {
    "DB_HOST" = aws_db_proxy.db_proxy.endpoint
    "DB_PORT" = aws_db_instance.ecom-rds.port
    "DB_USER" = aws_db_instance.ecom-rds.username
    "DB_NAME" = aws_db_instance.ecom-rds.name
    "API_KEY" = random_string.internal_api_key.result
  }
  subnet_ids         = ["subnet-16911271"]
  security_group_ids = ["sg-1a9bc47c"]
  policies_arn       = [aws_iam_policy.iam_policy_rds.arn]
}

module "fnc-increase-quantity" {
  source = "../../resources/lambda"

  layers        = [aws_lambda_layer_version.inventory_common_layer.arn]
  env_prefix    = terraform.workspace
  function_name = "increase-quantity"
  source_dir    = "../services/inventory/dist/increase-quantity"
  output_path   = "../archived/inventory/increase-quantity.zip"
  depends_on = [
    aws_lambda_layer_version.inventory_common_layer
  ]
  env = {
    "DB_HOST" = aws_db_proxy.db_proxy.endpoint
    "DB_PORT" = aws_db_instance.ecom-rds.port
    "DB_USER" = aws_db_instance.ecom-rds.username
    "DB_NAME" = aws_db_instance.ecom-rds.name
    "API_KEY" = random_string.internal_api_key.result
  }
  subnet_ids         = ["subnet-16911271"]
  security_group_ids = ["sg-1a9bc47c"]
  policies_arn       = [aws_iam_policy.iam_policy_rds.arn]
}
