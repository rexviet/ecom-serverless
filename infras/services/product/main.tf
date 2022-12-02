module "fnc-get-products" {
  source = "../../resources/lambda"

  layers        = [aws_lambda_layer_version.product_common_layer.arn]
  env_prefix    = terraform.workspace
  function_name = "get-products"
  source_dir    = "../services/product/dist/get-products"
  output_path   = "../archived/product/get-products.zip"
  depends_on = [
    aws_lambda_layer_version.product_common_layer
  ]
  env = {
    "CONNECTION_STRING" = var.connection_string
  }
  subnet_ids         = ["subnet-16911271"]
  security_group_ids = ["sg-1a9bc47c"]
}

resource "aws_api_gateway_resource" "products_resource" {
  rest_api_id = var.rest_api_id
  parent_id   = var.root_resource_id
  path_part   = "products"
}

resource "aws_api_gateway_method" "products_api_method" {
  rest_api_id   = var.rest_api_id
  resource_id   = aws_api_gateway_resource.products_resource.id
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = var.authorizer_id

  request_parameters = {
    "method.request.path.proxy" = true,
  }
}

resource "aws_api_gateway_integration" "products_api_integration" {
  rest_api_id             = var.rest_api_id
  resource_id             = aws_api_gateway_resource.products_resource.id
  http_method             = aws_api_gateway_method.products_api_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = module.fnc-get-products.invoke_arn
}
