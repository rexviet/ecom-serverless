output "invoke_arn" {
  value = aws_lambda_function.function.invoke_arn
}

output "role_name" {
  value = aws_iam_role.iam_for_lambda.name
}

output "function_name" {
  value = "${var.env_prefix}_${var.function_name}"
}

output "function_arn" {
  value = aws_lambda_function.function.arn
}

output "invoke_policy_arn" {
  value = aws_iam_policy.lambda_invoke_policy.arn
}
