module "fnc-create-order" {
  source = "../../resources/lambda"

  layers        = [aws_lambda_layer_version.order_common_layer.arn]
  env_prefix    = terraform.workspace
  function_name = "create-order"
  source_dir    = "../services/order/dist/create-order"
  output_path   = "../archived/order/create-order.zip"
  depends_on = [
    aws_lambda_layer_version.order_common_layer
  ]
  env = {
    "DB_HOST"                     = var.rds_db_host
    "DB_PORT"                     = var.rds_db_port
    "DB_USER"                     = var.rds_db_user
    "DB_NAME"                     = var.rds_db_name
    "INCREASE_QUANTITY_FUNC_NAME" = var.increase_quantity_fnc_name
    "INVENTORY_SERVICE_API_KEY"   = var.inventory_service_internal_api_key
  }
  subnet_ids         = var.subnet_ids
  security_group_ids = var.security_group_ids
  policies_arn       = var.additional_policies_arn
  invoke_principle   = "apigateway.amazonaws.com"
  invoke_src_arn     = "${var.rest_api_execution_arn}/*/*/*"
  timeout            = 30
}

// /orders
resource "aws_api_gateway_resource" "orders_resource" {
  rest_api_id = var.rest_api_id
  parent_id   = var.root_resource_id
  path_part   = "orders"
}

// POST /orders
resource "aws_api_gateway_method" "create_order_method" {
  rest_api_id   = var.rest_api_id
  resource_id   = aws_api_gateway_resource.orders_resource.id
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = var.authorizer_id
}

resource "aws_api_gateway_integration" "create_order_api_integration" {
  rest_api_id             = var.rest_api_id
  resource_id             = aws_api_gateway_resource.orders_resource.id
  http_method             = aws_api_gateway_method.create_order_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = module.fnc-create-order.invoke_arn
}

resource "aws_lambda_permission" "invoke_increase_quantity_permission" {
  action        = "lambda:InvokeFunction"
  function_name = var.increase_quantity_fnc_name
  principal     = "lambda.amazonaws.com"
  source_arn    = module.fnc-create-order.function_arn
}
