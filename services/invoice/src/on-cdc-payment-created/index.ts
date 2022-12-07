import { SQSEvent } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { ICdcPaymentCreatedUS, InvoiceOnCdcPaymentCreatedUS } from './use-cases/invoiceOnCdcPaymentCreatedUS';
import { S3FileDSImpl } from '/opt/nodejs/data-sources/file.ds';
import { IPaymentModel } from '/opt/nodejs/models/payment.model';
import { FileRepositoryImpl } from '/opt/nodejs/repositories/file.repository';
import { GenerateInvoiceUS } from '/opt/nodejs/use-cases/generate-invoice/generateInvoiceUS';
import { UploadFileToBlobStorageUS } from '/opt/nodejs/use-cases/upload-file-to-blob-storage/uploadFileToBlobStorageUS';
import { messageHandler } from '/opt/nodejs/utils/messageHandler';

let onCdcPaymentCreatedUS: ICdcPaymentCreatedUS;

const func = async (event: SQSEvent) => {
  if (!onCdcPaymentCreatedUS) {
    onCdcPaymentCreatedUS = initCdcPaymentCreatedUS();
  }
  const promises = event.Records.map((record) => {
    const jsonBody = JSON.parse(record.body);
    const payment: IPaymentModel = JSON.parse(jsonBody.Message);
    return onCdcPaymentCreatedUS.execute(payment);
  });
  await Promise.all(promises);
};

const initCdcPaymentCreatedUS = () => {
  const generateInvoiceUS = new GenerateInvoiceUS();

  const fileDS = new S3FileDSImpl(new S3(), { bucketName: process.env.INVOICE_BUCKET });
  const fileRepo = new FileRepositoryImpl(fileDS);
  const uploadFileToBlobStorageUS = new UploadFileToBlobStorageUS(fileRepo);

  return new InvoiceOnCdcPaymentCreatedUS(generateInvoiceUS, uploadFileToBlobStorageUS);
};

exports.handler = messageHandler(func);
