output "internal_api_key" {
  value = random_string.internal_api_key.result
}

output "get_order_fnc_name" {
  value = module.fnc-get-order.function_name
}

output "get_order_invoke_arn" {
  value = module.fnc-get-order.invoke_policy_arn
}
