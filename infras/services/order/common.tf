data "archive_file" "order_common_layer_file" {
  type        = "zip"
  source_dir  = "../services/order/dist/dependencies"
  output_path = "../archived/order/order_common_layer.zip"
}

resource "aws_lambda_layer_version" "order_common_layer" {
  filename            = "../archived/order/order_common_layer.zip"
  layer_name          = "order_common_layer"
  source_code_hash    = data.archive_file.order_common_layer_file.output_base64sha256
  compatible_runtimes = ["nodejs12.x"]
}

resource "random_string" "internal_api_key" {
  length  = 16
  special = false
}
