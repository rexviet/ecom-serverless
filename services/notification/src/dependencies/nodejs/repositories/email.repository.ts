import { IEmailDS } from '../data-sources/email.ds';
import { IOrderModel } from '../models/order.model';

export interface IEmailRepository {
  sendInvoiceEmail(order: IOrderModel, invoiceBase64: string): Promise<void>;
}

export class EmailRepositoryImpl implements IEmailRepository {
  constructor(private readonly emailDS: IEmailDS) {}

  public async sendInvoiceEmail(order: IOrderModel, invoiceBase64: string): Promise<void> {
    return this.emailDS.sendInvoiceEmail(order, invoiceBase64);
  }
}
