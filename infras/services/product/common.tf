data "archive_file" "product_common_layer_file" {
  type        = "zip"
  source_dir  = "../services/product/dist/dependencies"
  output_path = "../archived/product/product_common_layer.zip"
}

resource "aws_lambda_layer_version" "product_common_layer" {
  filename            = "../archived/product/product_common_layer.zip"
  layer_name          = "product_common_layer"
  source_code_hash    = data.archive_file.product_common_layer_file.output_base64sha256
  compatible_runtimes = ["nodejs12.x"]
}
