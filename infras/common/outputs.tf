output "connect_rds_arn" {
  value = aws_iam_policy.lambda_connect_rds_iam_policy.arn
}

output "rds_db_host" {
  value = aws_db_proxy.db_proxy.endpoint
}

output "rds_db_port" {
  value = aws_db_instance.ecom-rds.port
}

output "rds_db_user" {
  value = aws_db_instance.ecom-rds.username
}

output "rds_db_name" {
  value = aws_db_instance.ecom-rds.name
}

output "subnet_ids" {
  value = [aws_subnet.subnet_private.id, aws_subnet.subnet_private_2.id]
}

output "security_group_ids" {
  value = [aws_default_security_group.default_security_group.id]
}

output "rest_api_id" {
  value = aws_api_gateway_rest_api.rest_api.id
}

output "root_resource_id" {
  value = aws_api_gateway_rest_api.rest_api.root_resource_id
}

output "authorizer_id" {
  value = aws_api_gateway_authorizer.api_authorizer.id
}

output "rest_api_execution_arn" {
  value = aws_api_gateway_rest_api.rest_api.execution_arn
}

output "cdc-payment-created_arn" {
  value = module.cdc-payment-created.topic_arn
}

output "cdc-payment-created_q_arn_mapper" {
  value = module.cdc-payment-created.q_arn_mapper
}

output "cdc-payment-created_publish_policy_arn" {
  value = module.cdc-payment-created.topic_publish_policy_arn
}

output "invoice_bucket_name" {
  value = aws_s3_bucket.invoice_bucket.id
}

output "invoice_bucket_arn" {
  value = aws_s3_bucket.invoice_bucket.arn
}

output "s3_put_policy_arn" {
  value = aws_iam_policy.lambda_put_s3_iam_policy.arn
}
