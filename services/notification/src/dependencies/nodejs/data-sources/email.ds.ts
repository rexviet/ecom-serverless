import Mailjet from 'node-mailjet';
import { IOrderModel } from '../models/order.model';

export interface IEmailDS {
  sendInvoiceEmail(order: IOrderModel, invoiceBase64: string): Promise<void>;
}

export class MailjetDS implements IEmailDS {
  constructor(private readonly mailjet: Mailjet, private readonly systemEmail: string) {}

  public async sendInvoiceEmail(order: IOrderModel, invoiceBase64: string): Promise<void> {
    await this.mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: this.systemEmail,
            Name: 'Ecom Serverless',
          },
          To: [
            {
              Email: order.email,
              Name: order.user_name,
            },
          ],
          TemplateID: 4416481,
          TemplateLanguage: true,
          Subject: 'Ecom Serverless Invoice',
          Variables: {
            firstname: order.user_name,
            total_price: order.value,
            order_date: new Date(order.created_at).toISOString(),
            order_id: order.id,
          },
          Attachments: [
            {
              ContentType: 'application/pdf',
              Filename: `invoice_${order.id}.pdf`,
              Base64Content: invoiceBase64,
            },
          ],
        },
      ],
    });
  }
}
