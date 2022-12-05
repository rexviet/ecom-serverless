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

# resource "aws_iam_policy" "iam_policy_rds" {
#   name        = "${terraform.workspace}_lambda_access-rds-policy"
#   description = "IAM Policy"
#   policy      = <<EOF
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#         "Effect": "Allow",
#         "Action": [
#             "rds-db:connect"
#         ],
#         "Resource": "arn:aws:rds-db:${var.region}:${local.account_id}:dbuser:prx-07a216821603cc10d/*"
#     }
#   ]
# }
#   EOF
# }
