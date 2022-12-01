locals {
  redrive_policy = var.create_dlq == true ? jsonencode({
    deadLetterTargetArn = aws_sqs_queue.deadletter_queue[0].arn
    maxReceiveCount     = var.retry
  }) : null
  q_name   = var.fifo_queue == true ? "${var.q_name}.fifo" : var.q_name
  dlq_name = var.fifo_queue == true ? "${var.q_name}_DLQ.fifo" : "${var.q_name}_DLQ"
}

resource "aws_sqs_queue" "deadletter_queue" {
  count      = var.create_dlq == true ? 1 : 0
  name       = local.dlq_name
  fifo_queue = var.fifo_queue
}

resource "aws_sqs_queue" "queue" {
  name           = local.q_name
  tags           = var.tags
  fifo_queue     = var.fifo_queue
  redrive_policy = local.redrive_policy
  depends_on     = [aws_sqs_queue.deadletter_queue]
}

resource "aws_sns_topic_subscription" "subscription" {
  topic_arn  = var.topic_arn
  protocol   = "sqs"
  endpoint   = aws_sqs_queue.queue.arn
  depends_on = [aws_sqs_queue.queue]
}

resource "aws_sqs_queue_policy" "sns_to_sqs_policy" {
  queue_url = aws_sqs_queue.queue.id
  policy    = data.aws_iam_policy_document.sns_to_sqs_policy_document.json
}

data "aws_iam_policy_document" "sns_to_sqs_policy_document" {
  statement {
    actions = ["sqs:SendMessage"]

    resources = ["${aws_sqs_queue.queue.arn}"]
    sid       = "${var.q_name}_policy"
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    condition {
      test     = "ArnEquals"
      variable = "aws:SourceArn"

      values = ["${var.topic_arn}"]
    }
  }
}
