module "fnc-get-inven-by-sku" {
  source        = "../../resources/lambda"
  layers        = [aws_lambda_layer_version.inventory_common_layer.arn]
  env_prefix    = terraform.workspace
  function_name = "get-inven-by-sku"
  source_dir    = "../services/inventory/dist/get-inventory-by-sku"
  output_path   = "../archived/inventory/get-inventory-by-sku.zip"
  depends_on = [
    aws_lambda_layer_version.inventory_common_layer,
  ]
  env = {
    "DB_HOST" = var.rds_db_host
    "DB_PORT" = var.rds_db_port
    "DB_USER" = var.rds_db_user
    "DB_NAME" = var.rds_db_name
    "API_KEY" = random_string.internal_api_key.result
  }
  subnet_ids         = var.subnet_ids
  security_group_ids = var.security_group_ids
  policies_arn       = [var.connect_rds_policy_arn]
}

module "fnc-increase-quantity" {
  source = "../../resources/lambda"

  layers        = [aws_lambda_layer_version.inventory_common_layer.arn]
  env_prefix    = terraform.workspace
  function_name = "increase-quantity"
  source_dir    = "../services/inventory/dist/increase-quantity"
  output_path   = "../archived/inventory/increase-quantity.zip"
  depends_on = [
    aws_lambda_layer_version.inventory_common_layer,
  ]
  env = {
    "DB_HOST" = var.rds_db_host
    "DB_PORT" = var.rds_db_port
    "DB_USER" = var.rds_db_user
    "DB_NAME" = var.rds_db_name
    "API_KEY" = random_string.internal_api_key.result
  }
  subnet_ids         = var.subnet_ids
  security_group_ids = var.security_group_ids
  policies_arn       = [var.connect_rds_policy_arn]
}
