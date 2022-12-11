resource "aws_s3_bucket" "invoice_bucket" {
  bucket = "ecom-invoices"

  tags = {
    Name        = "Ecom Invoices bucket"
    Environment = "Dev"
  }
}

resource "aws_s3_bucket_acl" "example" {
  bucket = aws_s3_bucket.invoice_bucket.id
  acl    = "private"
}

resource "aws_iam_policy" "lambda_put_s3_iam_policy" {
  name        = "${terraform.workspace}_lambda_put_s3_policy"
  description = "IAM Policy"
  policy      = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
        "Effect": "Allow",
        "Action": [
            "s3:PutObject"
        ],
        "Resource": "${aws_s3_bucket.invoice_bucket.arn}/*"
    }
  ]
}
  EOF
}

resource "aws_iam_policy" "lambda_get_s3_iam_policy" {
  name        = "${terraform.workspace}_lambda_get_s3_policy"
  description = "IAM Policy"
  policy      = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
        "Effect": "Allow",
        "Action": [
            "s3:GetObject"
        ],
        "Resource": "${aws_s3_bucket.invoice_bucket.arn}/*"
    }
  ]
}
  EOF
}
