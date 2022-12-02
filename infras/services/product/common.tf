resource "aws_docdb_cluster" "docdb" {
  cluster_identifier = var.cluster_identifier
  engine             = "docdb"
  master_username    = var.master_username
  master_password    = var.master_password
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
