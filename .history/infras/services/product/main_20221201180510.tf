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
