resource "aws_api_gateway_rest_api" "rest_api" {
  name        = "ecom-api-gateway"
  description = "Ecom API Gateway"
}

resource "aws_api_gateway_authorizer" "api_authorizer" {
  name          = "CognitoUserPoolAuthorizer"
  type          = "COGNITO_USER_POOLS"
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  provider_arns = [aws_cognito_user_pool.ecom_user_pool.arn]
}

resource "aws_api_gateway_deployment" "deployment" {
  rest_api_id       = aws_api_gateway_rest_api.rest_api.id
  stage_description = "Deployed at ${timestamp()}"

  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.rest_api.body))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "stage" {
  deployment_id = aws_api_gateway_deployment.deployment.id
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  stage_name    = terraform.workspace
}
