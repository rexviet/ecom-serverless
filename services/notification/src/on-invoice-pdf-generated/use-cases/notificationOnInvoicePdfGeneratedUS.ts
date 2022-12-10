import { Base64Encode } from 'base64-stream';
import { IEmailRepository } from '/opt/nodejs/repositories/email.repository';
import { IFileRepository } from '/opt/nodejs/repositories/file.repository';
import { IOrderRepository } from '/opt/nodejs/repositories/order.repository';

export interface OnInvoicePdfGeneratedUS {
  execute(bucketName: string, objectKey: string): Promise<void>;
}

export class NotificationOnInvoicePdfGeneratedUS implements OnInvoicePdfGeneratedUS {
  constructor(
    private readonly orderRepo: IOrderRepository,
    private readonly emailRepo: IEmailRepository,
    private readonly fileRepository: IFileRepository
  ) {}

  public async execute(bucketName: string, objectKey: string): Promise<void> {
    const [orderId] = objectKey.substring(objectKey.indexOf('#') + 1).split('.');

    const [order, invoiceBase64] = await Promise.all([
      this.orderRepo.getOrder(Number(orderId)),
      this.downloadInvoice(bucketName, objectKey),
    ]);

    return this.emailRepo.sendInvoiceEmail(order, invoiceBase64);
  }

  private downloadInvoice(bucketName: string, objectKey: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const objectStream = await this.fileRepository.getFile(bucketName, objectKey);
      const base64Stream = objectStream.pipe(new Base64Encode());
      let finalString = '';

      base64Stream.on('data', (chunk) => {
        finalString += chunk;
      });

      base64Stream.on('end', () => {
        return resolve(finalString);
      });

      base64Stream.on('error', (err) => {
        return reject(err);
      });
    });
  }
}
