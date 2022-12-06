output "topic_arn" {
  value = aws_sns_topic.topic.arn
}

output "q_arn_mapper" {
  # value = module.queues.queue_arn
  value = zipmap(values(module.queues)[*].q_name, values(module.queues)[*].queue_arn)
}

output "topic_publish_policy_arn" {
  value = aws_iam_policy.publish_sns_iam_policy.arn
}
