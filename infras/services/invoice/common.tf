data "archive_file" "invoice_common_layer_file" {
  type        = "zip"
  source_dir  = "../services/invoice/dist/dependencies"
  output_path = "../archived/invoice/invoice_common_layer.zip"
}

resource "aws_lambda_layer_version" "invoice_common_layer" {
  filename            = "../archived/invoice/invoice_common_layer.zip"
  layer_name          = "invoice_common_layer"
  source_code_hash    = data.archive_file.invoice_common_layer_file.output_base64sha256
  compatible_runtimes = ["nodejs12.x"]
}

data "archive_file" "invoice_pdf_layer_file" {
  type        = "zip"
  source_dir  = "../services/invoice/dist/pdf-layer"
  output_path = "../archived/invoice/invoice_pdf_layer.zip"
}

resource "aws_lambda_layer_version" "invoice_pdf_layer" {
  filename            = "../archived/invoice/invoice_pdf_layer.zip"
  layer_name          = "invoice_pdf_layer"
  source_code_hash    = data.archive_file.invoice_pdf_layer_file.output_base64sha256
  compatible_runtimes = ["nodejs12.x"]
}
