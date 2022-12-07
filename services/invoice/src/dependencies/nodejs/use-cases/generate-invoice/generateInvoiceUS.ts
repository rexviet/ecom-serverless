import PDFDocument from 'pdfkit';
import { IPaymentModel } from '../../models/payment.model';
import { IOrderModel } from '../../models/order.model';

export interface IGenerateInvoiceUS {
  execute(payment: IPaymentModel): Promise<Buffer>;
}

export class GenerateInvoiceUS implements IGenerateInvoiceUS {
  public async execute(payment: IPaymentModel): Promise<Buffer> {
    // const html = this.buildHtml(payment);
    // return this.generatePdf(html);
    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 50 });
      this.generateHeader(doc); // Invoke `generateHeader` function.
      this.generateCustomerInformation(doc, payment.order);
      this.generateInvoiceTable(doc, payment.order);

      doc.end();

      const buffers: Uint8Array[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        return resolve(pdfData);
      });
    });
  }

  private generateHr(doc: PDFKit.PDFDocument, y: number): void {
    doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
  }

  private generateCustomerInformation(doc: PDFKit.PDFDocument, order: IOrderModel) {
    doc.fillColor('#444444').fontSize(20).text('Invoice', 50, 160);

    this.generateHr(doc, 185);

    const customerInformationTop = 200;
    doc
      .fontSize(10)
      .text('Invoice Number:', 50, customerInformationTop)
      .font('Helvetica-Bold')
      .text(order.id.toString(), 150, customerInformationTop)
      .font('Helvetica')
      .text('Invoice Date:', 50, customerInformationTop + 15)
      .text(new Date(order.created_at).toISOString(), 150, customerInformationTop + 15)
      .font('Helvetica-Bold')
      .text(order.user_name, 300, customerInformationTop)
      .font('Helvetica')
      .text(order.address, 300, customerInformationTop + 15)
      .moveDown();

    this.generateHr(doc, 252);
  }

  private generateHeader(doc: PDFKit.PDFDocument): void {
    doc
      .fontSize(10)
      .text('Ecom Demo', 200, 55, { align: 'right' })
      .text('(123) 456 789', 200, 65, { align: 'right' })
      .text('company@example.com', 200, 80, { align: 'right' })
      .moveDown();
  }

  private generateTableRow(
    doc: PDFKit.PDFDocument,
    y: number,
    item: string,
    description: string,
    unitCost: string,
    quantity: string,
    lineTotal: string
  ) {
    doc
      .fontSize(10)
      .text(item, 50, y)
      .text(description, 150, y)
      .text(unitCost, 280, y, { width: 90, align: 'right' })
      .text(quantity, 370, y, { width: 90, align: 'right' })
      .text(lineTotal, 0, y, { align: 'right' });
  }

  private generateInvoiceTable(doc: PDFKit.PDFDocument, order: any) {
    let i: number;
    const invoiceTableTop = 330;

    doc.font('Helvetica-Bold');
    this.generateTableRow(doc, invoiceTableTop, '#', 'Description', 'Unit Cost', 'Quantity', 'Line Total');
    this.generateHr(doc, invoiceTableTop + 20);
    doc.font('Helvetica');
    let subTotal = 0;
    const promotion = 0;
    for (i = 0; i < order.detail.length; i++) {
      const item = order.detail[i];
      subTotal += item.value;
      const position = invoiceTableTop + (i + 1) * 30;
      this.generateTableRow(
        doc,
        position,
        (i + 1).toString(),
        item.product.name,
        item.product.price,
        item.quantity,
        item.value
      );

      this.generateHr(doc, position + 20);
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    this.generateTableRow(doc, subtotalPosition, '', '', 'Subtotal', '', subTotal.toString());

    const paidToDatePosition = subtotalPosition + 20;
    this.generateTableRow(doc, paidToDatePosition, '', '', 'Promotion', '', '0');

    const duePosition = paidToDatePosition + 25;
    doc.font('Helvetica-Bold');
    this.generateTableRow(doc, duePosition, '', '', 'GRAND TOTAL', '', (subTotal - promotion).toString());
    doc.font('Helvetica');
  }
}
