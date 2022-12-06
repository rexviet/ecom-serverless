locals {
  topic_name = var.fifo_topic == true ? "${var.topic_name}.fifo" : var.topic_name
}

resource "aws_sns_topic" "topic" {
  name       = "${var.env}-${local.topic_name}"
  fifo_topic = var.fifo_topic
}

module "queues" {
  source   = "../../modules/sqs"
  for_each = var.queue_list

  q_name     = "${var.env}-${each.key}-${var.topic_name}"
  create_dlq = each.value.create_dlq
  topic_arn  = aws_sns_topic.topic.arn
  fifo_queue = var.fifo_topic
}

resource "aws_iam_policy" "publish_sns_iam_policy" {
  name        = "${var.env}_${local.topic_name}_publish_policy"
  description = "IAM Policy"
  policy      = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
        "Effect": "Allow",
        "Action": [
            "sns:Publish"
        ],
        "Resource": "${aws_sns_topic.topic.arn}"
    }
  ]
}
  EOF
}
