resource "aws_docdb_cluster" "docdb" {
  cluster_identifier = var.cluster_identifier
  engine             = "docdb"
  master_username    = var.master_username
  master_password    = var.master_password
}
