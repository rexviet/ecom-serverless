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
    # "INVENTORY_SERVICE_ENDPOINT" = var.inventory_service_path
  }
  subnet_ids         = var.subnet_ids
  security_group_ids = var.security_group_ids
  invoke_principle   = "apigateway.amazonaws.com"
  invoke_src_arn     = "${var.rest_api_execution_arn}/*/*/*"
}

// List products
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
    "method.request.path.id"    = true,
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

module "fnc-get-detail-product" {
  source = "../../resources/lambda"

  layers        = [aws_lambda_layer_version.product_common_layer.arn]
  env_prefix    = terraform.workspace
  function_name = "get-detail-product"
  source_dir    = "../services/product/dist/get-detail-product"
  output_path   = "../archived/product/get-detail-product.zip"
  depends_on = [
    aws_lambda_layer_version.product_common_layer
  ]
  env = {
    "CONNECTION_STRING"         = var.connection_string
    INCREASE_QUANTITY_FUNC_NAME = var.increase_quantity_fnc_name
    INVENTORY_SERVICE_API_KEY   = var.inventory_service_internal_api_key
  }
  subnet_ids         = var.subnet_ids
  security_group_ids = var.security_group_ids
  invoke_principle   = "apigateway.amazonaws.com"
  invoke_src_arn     = "${var.rest_api_execution_arn}/*/*/*"
  timeout            = 10
}

// Detail product
resource "aws_api_gateway_resource" "detail_product" {
  rest_api_id = var.rest_api_id
  parent_id   = aws_api_gateway_resource.products_resource.id
  path_part   = "{id}"
  depends_on = [
    aws_api_gateway_resource.products_resource
  ]
}

resource "aws_api_gateway_method" "detail_product_api_method" {
  rest_api_id   = var.rest_api_id
  resource_id   = aws_api_gateway_resource.detail_product.id
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = var.authorizer_id

  request_parameters = {
    "method.request.path.proxy" = true,
    "method.request.path.id"    = true,
  }
}

resource "null_resource" "method-delay" {
  provisioner "local-exec" {
    command = "sleep 5"
  }
  triggers = {
    response = aws_api_gateway_resource.detail_product.id
  }
}

resource "aws_api_gateway_integration" "detail_product_api_integration" {
  rest_api_id             = var.rest_api_id
  resource_id             = aws_api_gateway_resource.detail_product.id
  http_method             = aws_api_gateway_method.detail_product_api_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = module.fnc-get-detail-product.invoke_arn
  request_parameters = {
    "integration.request.path.id" = "method.request.path.id"
  }

  depends_on = [
    null_resource.method-delay,
    module.fnc-get-detail-product,
    aws_api_gateway_resource.detail_product,
    aws_api_gateway_method.products_api_method
  ]
}


