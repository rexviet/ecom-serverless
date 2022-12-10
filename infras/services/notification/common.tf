data "archive_file" "notification_common_layer_file" {
  type        = "zip"
  source_dir  = "../services/notification/dist/dependencies"
  output_path = "../archived/notification/notification_common_layer.zip"
}

resource "aws_lambda_layer_version" "notification_common_layer" {
  filename            = "../archived/notification/notification_common_layer.zip"
  layer_name          = "notification_common_layer"
  source_code_hash    = data.archive_file.notification_common_layer_file.output_base64sha256
  compatible_runtimes = ["nodejs12.x"]
}
