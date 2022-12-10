module "fnc-notification-on-invoice-generated" {
  source = "../../resources/lambda"

  layers        = [aws_lambda_layer_version.notification_common_layer.arn]
  env_prefix    = terraform.workspace
  function_name = "notification-on-invoice-generated"
  source_dir    = "../services/notification/dist/on-invoice-pdf-generated"
  output_path   = "../archived/notification/on-invoice-pdf-generated.zip"
  depends_on = [
    aws_lambda_layer_version.notification_common_layer
  ]
  env = {
    "GET_ORDER_FUNC_NAME"   = var.get_order_fnc_name
    "ORDER_SERVICE_API_KEY" = var.order_service_internal_api_key
    "MAILJET_API_KEY"       = var.mailjet_api_key
    "MAILJET_API_SECRET"    = var.mailjet_api_secret
    "SYSTEM_EMAIL"          = var.system_email
    "INVOICE_BUCKET"        = var.invoice_bucket_name
  }
  subnet_ids         = var.subnet_ids
  security_group_ids = var.security_group_ids
  policies_arn       = [var.get_order_invoke_arn, var.s3_get_object_policy_arn]
  timeout            = 10
}

resource "aws_lambda_permission" "allow_bucket_invoke_lambda" {
  depends_on = [
    module.fnc-notification-on-invoice-generated
  ]
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = module.fnc-notification-on-invoice-generated.function_arn
  principal     = "s3.amazonaws.com"
  source_arn    = var.invoice_bucket_arn
}

resource "aws_s3_bucket_notification" "bucket_notification" {
  depends_on = [aws_lambda_permission.allow_bucket_invoke_lambda]

  bucket = var.invoice_bucket_name

  lambda_function {
    lambda_function_arn = module.fnc-notification-on-invoice-generated.function_arn
    events              = ["s3:ObjectCreated:*"]
  }
}
