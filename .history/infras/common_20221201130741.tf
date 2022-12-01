/***** Start COGNITO REGION *****/
resource "aws_cognito_user_pool" "ecom_user_pool" {
  name = "EcomlUserPool"

  email_verification_subject = "Your Verification Code"
  email_verification_message = "Please use the following code: {####}"
  alias_attributes           = ["email"]
  auto_verified_attributes   = ["email"]

  password_policy {
    minimum_length    = 6
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  username_configuration {
    case_sensitive = false
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "email"
    required                 = true

    string_attribute_constraints {
      min_length = 7
      max_length = 256
    }
  }
}

resource "aws_cognito_user_pool_client" "ecom_gateway_client" {
  name                = "EcomAPIGateway"
  explicit_auth_flows = ["ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]

  user_pool_id = aws_cognito_user_pool.ecom_user_pool.id

  callback_urls                        = ["https://example.com"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_scopes                 = ["email", "openid"]
  supported_identity_providers         = ["COGNITO"]
}

resource "aws_cognito_user_pool_domain" "main" {
  domain       = "viet-ecom"
  user_pool_id = aws_cognito_user_pool.ecom_user_pool.id
}
/****** End COGNITO REGION ******/

/***** Start APIGateway REGION *****/
resource "aws_api_gateway_rest_api" "rest_api" {
  name        = "ecom-api-gateway"
  description = "Ecom API Gateway"
}

resource "aws_api_gateway_resource" "check_in_resource" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  parent_id   = aws_api_gateway_rest_api.rest_api.root_resource_id
  path_part   = "check-in"
}

/****** End APIGateway REGION ******/
