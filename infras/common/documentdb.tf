resource "aws_docdb_subnet_group" "docdb_private_subnet" {
  name       = "${var.project}_docdb_private_subnet"
  subnet_ids = [aws_subnet.subnet_private.id, aws_subnet.subnet_private_2.id]
}

resource "aws_docdb_cluster" "docdb" {
  cluster_identifier     = var.cluster_identifier
  engine                 = "docdb"
  master_username        = var.master_username
  master_password        = var.master_password
  vpc_security_group_ids = [aws_default_security_group.default_security_group.id]
  db_subnet_group_name   = aws_docdb_subnet_group.docdb_private_subnet.name
  skip_final_snapshot    = true
}

resource "aws_docdb_cluster_instance" "cluster_instances" {
  count              = 1
  identifier         = "${var.cluster_identifier}-${count.index}"
  cluster_identifier = aws_docdb_cluster.docdb.id
  instance_class     = var.instance_class
}
