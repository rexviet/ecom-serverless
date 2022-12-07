module "fnc-create-payment" {
  source = "../../resources/lambda"

  layers        = [aws_lambda_layer_version.payment_common_layer.arn]
  env_prefix    = terraform.workspace
  function_name = "create-payment"
  source_dir    = "../services/payment/dist/create-payment"
  output_path   = "../archived/payment/create-payment.zip"
  depends_on = [
    aws_lambda_layer_version.payment_common_layer
  ]
  env = {
    "DB_HOST"                   = var.rds_db_host
    "DB_PORT"                   = var.rds_db_port
    "DB_USER"                   = var.rds_db_user
    "DB_NAME"                   = var.rds_db_name
    "PAYMENT_CREATED_TOPIC_ARN" = var.payment_created_topic_arn
    "GET_ORDER_FUNC_NAME"       = var.get_order_fnc_name
    "ORDER_SERVICE_API_KEY"     = var.order_service_internal_api_key
  }
  subnet_ids         = var.subnet_ids
  security_group_ids = var.security_group_ids
  policies_arn       = [var.connect_rds_arn, var.cdc_payment_created_publish_policy_arn, var.get_order_invoke_arn]
  invoke_principle   = "apigateway.amazonaws.com"
  invoke_src_arn     = "${var.rest_api_execution_arn}/*/*/*"
  timeout            = 10
}

// /payments
resource "aws_api_gateway_resource" "payments_resource" {
  rest_api_id = var.rest_api_id
  parent_id   = var.root_resource_id
  path_part   = "payments"
}

// POST /payments
resource "aws_api_gateway_method" "create_payment_method" {
  rest_api_id   = var.rest_api_id
  resource_id   = aws_api_gateway_resource.payments_resource.id
  http_method   = "POST"
  authorization = "NONE"
  #   authorizer_id = var.authorizer_id
}

resource "aws_api_gateway_integration" "create_payment_api_integration" {
  rest_api_id             = var.rest_api_id
  resource_id             = aws_api_gateway_resource.payments_resource.id
  http_method             = aws_api_gateway_method.create_payment_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = module.fnc-create-payment.invoke_arn
}
