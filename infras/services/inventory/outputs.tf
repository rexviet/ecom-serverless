output "internal_api_key" {
  value = random_string.internal_api_key.result
}

output "increase_quantity_fnc_name" {
  value = module.fnc-increase-quantity.function_name
}

output "increase_quantity_invoke_arn" {
  value = module.fnc-increase-quantity.invoke_policy_arn
}
