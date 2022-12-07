import { PaymentStatus } from '/opt/nodejs/common/payment.enum';
import { IPaymentModel } from '/opt/nodejs/models/payment.model';
import { IGenerateInvoiceUS } from '/opt/nodejs/use-cases/generate-invoice/generateInvoiceUS';
import { IUploadFileToBlobStorageUS } from '/opt/nodejs/use-cases/upload-file-to-blob-storage/uploadFileToBlobStorageUS';

export interface ICdcPaymentCreatedUS {
  execute(payment: IPaymentModel): Promise<void>;
}

export class InvoiceOnCdcPaymentCreatedUS implements ICdcPaymentCreatedUS {
  constructor(
    private readonly generateInvoiceUS: IGenerateInvoiceUS,
    private readonly uploadFileToBlobStorageUS: IUploadFileToBlobStorageUS
  ) {}

  public async execute(payment: IPaymentModel): Promise<void> {
    if (payment.status === PaymentStatus.FAIL) {
      return;
    }

    const invoiceBuffer = await this.generateInvoiceUS.execute(payment);
    await this.uploadFileToBlobStorageUS.execute(invoiceBuffer, `invoice_#${payment.order.id}.pdf`, 'application/pdf');
  }
}
