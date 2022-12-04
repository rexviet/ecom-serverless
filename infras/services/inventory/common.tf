resource "aws_db_instance" "ecom-rds" {
  identifier               = "ecom-rds"
  allocated_storage        = 10
  name                     = "ecomrds"
  engine                   = "postgres"
  instance_class           = "db.t3.micro"
  username                 = "root"
  password                 = "Viet1234"
  skip_final_snapshot      = true
  delete_automated_backups = false
  db_subnet_group_name     = "default"
  vpc_security_group_ids   = ["sg-1a9bc47c"]
}

resource "aws_secretsmanager_secret" "rds_secret" {
  name_prefix             = "rds-proxy-secret"
  recovery_window_in_days = 7
  description             = "Secret for RDS Proxy"
}

resource "aws_secretsmanager_secret_version" "rds_secret_version" {
  secret_id = aws_secretsmanager_secret.rds_secret.id
  secret_string = jsonencode({
    "username"             = "root"
    "password"             = "Viet1234"
    "engine"               = "postgres"
    "host"                 = aws_db_instance.ecom-rds.address
    "port"                 = 5432
    "dbInstanceIdentifier" = aws_db_instance.ecom-rds.id
  })
}

data "aws_iam_policy_document" "assume_role" {

  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["rds.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "rds_proxy_policy_document" {

  statement {
    sid = "AllowProxyToGetDbCredsFromSecretsManager"

    actions = [
      "secretsmanager:GetSecretValue"
    ]

    resources = [
      aws_secretsmanager_secret.rds_secret.arn
    ]
  }

  statement {
    sid = "AllowProxyToDecryptDbCredsFromSecretsManager"

    actions = [
      "kms:Decrypt"
    ]

    resources = [
      "*"
    ]

    condition {
      test     = "StringEquals"
      values   = ["secretsmanager.${var.region}.amazonaws.com"]
      variable = "kms:ViaService"
    }
  }
}

resource "aws_iam_policy" "rds_proxy_iam_policy" {
  name   = "rds-proxy-policy"
  policy = data.aws_iam_policy_document.rds_proxy_policy_document.json
}

resource "aws_iam_role_policy_attachment" "rds_proxy_iam_attach" {
  policy_arn = aws_iam_policy.rds_proxy_iam_policy.arn
  role       = aws_iam_role.rds_proxy_iam_role.name
}

resource "aws_iam_role" "rds_proxy_iam_role" {
  name               = "rds-proxy-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_db_proxy" "db_proxy" {
  name                   = "ecom-rds-proxy"
  debug_logging          = false
  engine_family          = "POSTGRESQL"
  idle_client_timeout    = 1800
  require_tls            = true
  role_arn               = aws_iam_role.rds_proxy_iam_role.arn
  vpc_security_group_ids = ["sg-1a9bc47c"]
  vpc_subnet_ids         = ["subnet-16911271", "subnet-932b9ada"]

  auth {
    auth_scheme = "SECRETS"
    iam_auth    = "REQUIRED"
    secret_arn  = aws_secretsmanager_secret.rds_secret.arn
  }
}

resource "aws_db_proxy_default_target_group" "rds_proxy_target_group" {
  db_proxy_name = aws_db_proxy.db_proxy.name

  connection_pool_config {
    connection_borrow_timeout = 120
    max_connections_percent   = 100
  }
}

resource "aws_db_proxy_target" "rds_proxy_target" {
  db_instance_identifier = aws_db_instance.ecom-rds.id
  db_proxy_name          = aws_db_proxy.db_proxy.name
  target_group_name      = aws_db_proxy_default_target_group.rds_proxy_target_group.name
}



data "archive_file" "inventory_common_layer_file" {
  type        = "zip"
  source_dir  = "../services/inventory/dist/dependencies"
  output_path = "../archived/inventory/inventory_common_layer.zip"
}

resource "aws_lambda_layer_version" "inventory_common_layer" {
  filename            = "../archived/inventory/inventory_common_layer.zip"
  layer_name          = "inventory_common_layer"
  source_code_hash    = data.archive_file.inventory_common_layer_file.output_base64sha256
  compatible_runtimes = ["nodejs12.x"]
}

resource "random_string" "internal_api_key" {
  length  = 16
  special = false
}

resource "aws_iam_policy" "iam_policy_rds" {
  name        = "${terraform.workspace}_lambda_access-rds-policy"
  description = "IAM Policy"
  policy      = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
        "Effect": "Allow",
        "Action": [
            "rds-db:connect"
        ],
        "Resource": "arn:aws:rds-db:${var.region}:${local.account_id}:dbuser:prx-07a216821603cc10d/*"
    }
  ]
}
  EOF
}
