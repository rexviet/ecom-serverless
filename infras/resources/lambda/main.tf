resource "aws_iam_role" "iam_for_lambda" {
  name = "${var.env_prefix}_iam_for_lambda-${var.function_name}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

# resource "aws_iam_policy" "iam_policy" {
#   name        = "${var.env_prefix}_lambda_access-policy-${var.function_name}"
#   description = "IAM Policy"
#   policy      = <<EOF
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#         "Effect": "Allow",
#         "Action": [
#             "sqs:*"
#         ],
#         "Resource": "${local.q_arn}"
#     }
#   ]
# }
#   EOF
# }

resource "aws_iam_role_policy_attachment" "default-iam-policy-attach" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_iam_role_policy_attachment" "additional-iam-policies-attach" {
  for_each = { for v in var.policies_arn : v => v }

  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = each.value
}

data "archive_file" "archived_function" {
  type        = "zip"
  source_dir  = var.source_dir
  output_path = var.output_path
}

resource "aws_lambda_function" "function" {
  filename         = var.output_path
  function_name    = "${var.env_prefix}_${var.function_name}"
  source_code_hash = data.archive_file.archived_function.output_base64sha256
  role             = aws_iam_role.iam_for_lambda.arn
  handler          = "index.handler"
  runtime          = "nodejs12.x"
  layers           = var.layers
  timeout          = var.timeout
  environment {
    variables = var.env
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "lambda_invoke_permission" {
  action        = "lambda:InvokeFunction"
  function_name = "${var.env_prefix}_${var.function_name}"
  principal     = var.invoke_principle

  # The /*/*/* part allows invocation from any stage, method and resource path
  # within API Gateway REST API.
  source_arn = var.invoke_src_arn
}
