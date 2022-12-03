resource "aws_docdb_subnet_group" "docdb_private_subnet" {
  name       = "docdb_private_subnet"
  subnet_ids = var.subnet_ids
}

resource "aws_docdb_cluster" "docdb" {
  cluster_identifier        = var.cluster_identifier
  engine                    = "docdb"
  master_username           = var.master_username
  master_password           = var.master_password
  vpc_security_group_ids    = var.security_group_ids
  db_subnet_group_name      = aws_docdb_subnet_group.docdb_private_subnet.name
  skip_final_snapshot       = true
  final_snapshot_identifier = "foo"
}

resource "aws_docdb_cluster_instance" "cluster_instances" {
  count              = 1
  identifier         = "${var.cluster_identifier}-${count.index}"
  cluster_identifier = aws_docdb_cluster.docdb.id
  instance_class     = var.instance_class
}

data "archive_file" "product_common_layer_file" {
  type        = "zip"
  source_dir  = "../services/product/dist/dependencies"
  output_path = "../archived/product/product_common_layer.zip"
}

resource "aws_lambda_layer_version" "product_common_layer" {
  filename            = "../archived/product/product_common_layer.zip"
  layer_name          = "product_common_layer"
  source_code_hash    = data.archive_file.product_common_layer_file.output_base64sha256
  compatible_runtimes = ["nodejs12.x"]
}
