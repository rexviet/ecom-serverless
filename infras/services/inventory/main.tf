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
  invoke_principle   = "apigateway.amazonaws.com"
  invoke_src_arn     = "${var.res_api_execution_arn}/*/*/*"
}

resource "aws_iam_policy" "iam_policy_rds" {
  name        = "${terraform.workspace}_lambda_access-rds-policy"
  description = "IAM Policy"
  policy      = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
        "Effect": "Allow",
        "Action": [
            "rds-db:connect"
        ],
        "Resource": "arn:aws:rds-db:${var.region}:${local.account_id}:dbuser:prx-07a216821603cc10d/root"
    }
  ]
}
  EOF
}

# resource "aws_iam_role_policy_attachment" "iam-policy-attach" {
#   role       = module.fnc-get-inven-by-sku.role_name
#   policy_arn = aws_iam_policy.iam_policy_rds.arn
# }

resource "aws_api_gateway_resource" "inventories_resource" {
  rest_api_id = var.rest_api_id
  parent_id   = var.root_resource_id
  path_part   = "inventories"
}

resource "aws_api_gateway_method" "inventories_api_method" {
  rest_api_id   = var.rest_api_id
  resource_id   = aws_api_gateway_resource.inventories_resource.id
  http_method   = "GET"
  authorization = "NONE"

  request_parameters = {
    "method.request.path.proxy" = true,
  }
}

resource "aws_api_gateway_integration" "inventories_api_integration" {
  rest_api_id             = var.rest_api_id
  resource_id             = aws_api_gateway_resource.inventories_resource.id
  http_method             = aws_api_gateway_method.inventories_api_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = module.fnc-get-inven-by-sku.invoke_arn
}
