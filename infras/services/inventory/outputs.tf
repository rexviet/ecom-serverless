# output "inventories_path" {
#   value = aws_api_gateway_resource.inventories_resource.path
# }

output "internal_api_key" {
  value = random_string.internal_api_key.result
}
