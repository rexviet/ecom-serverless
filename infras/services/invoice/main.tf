module "fnc-invoice-on-cdc-payment-created" {
  source = "../../resources/lambda"

  layers        = [aws_lambda_layer_version.invoice_common_layer.arn, aws_lambda_layer_version.invoice_pdf_layer.arn]
  env_prefix    = terraform.workspace
  function_name = "invoice-on-cdc-payment-created"
  source_dir    = "../services/invoice/dist/on-cdc-payment-created"
  output_path   = "../archived/invoice/on-cdc-payment-created.zip"
  depends_on = [
    aws_lambda_layer_version.invoice_common_layer,
    aws_lambda_layer_version.invoice_pdf_layer,
  ]
  env = {
    "INVOICE_BUCKET" = var.invoice_bucket_name
  }
  subnet_ids         = var.subnet_ids
  security_group_ids = var.security_group_ids
  policies_arn       = [var.s3_put_policy_arn]
  timeout            = 10
  q_arn              = var.queue_arn_mapper["${terraform.workspace}-invoice-cdc-payment-created"]
}
