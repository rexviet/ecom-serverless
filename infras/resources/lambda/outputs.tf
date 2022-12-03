output "invoke_arn" {
  value = aws_lambda_function.function.invoke_arn
}

output "role_name" {
  value = aws_iam_role.iam_for_lambda.name
}
