data "archive_file" "payment_common_layer_file" {
  type        = "zip"
  source_dir  = "../services/payment/dist/dependencies"
  output_path = "../archived/payment/payment_common_layer.zip"
}

resource "aws_lambda_layer_version" "payment_common_layer" {
  filename            = "../archived/payment/payment_common_layer.zip"
  layer_name          = "payment_common_layer"
  source_code_hash    = data.archive_file.payment_common_layer_file.output_base64sha256
  compatible_runtimes = ["nodejs12.x"]
}
