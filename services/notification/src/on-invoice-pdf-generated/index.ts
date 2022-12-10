import { S3Event } from 'aws-lambda';
import { Lambda, S3 } from 'aws-sdk';
import Mailjet from 'node-mailjet';
import {
  NotificationOnInvoicePdfGeneratedUS,
  OnInvoicePdfGeneratedUS,
} from './use-cases/notificationOnInvoicePdfGeneratedUS';
import { MailjetDS } from '/opt/nodejs/data-sources/email.ds';
import { S3FileDSImpl } from '/opt/nodejs/data-sources/file.ds';
import { OrderServiceDSImpl } from '/opt/nodejs/data-sources/order-service.ds';
import { EmailRepositoryImpl } from '/opt/nodejs/repositories/email.repository';
import { FileRepositoryImpl } from '/opt/nodejs/repositories/file.repository';
import { OrderRepositoryImpl } from '/opt/nodejs/repositories/order.repository';

let onInvoicePdfGeneratedUS: OnInvoicePdfGeneratedUS;

const func = async (event: S3Event) => {
  if (!onInvoicePdfGeneratedUS) {
    onInvoicePdfGeneratedUS = initOnInvoicePdfGeneratedUS();
  }
  const bucketName = event.Records[0].s3.bucket.name;
  const objectKey = decodeURIComponent(event.Records[0].s3.object.key);
  console.log('objectKey:', objectKey);
  await onInvoicePdfGeneratedUS.execute(bucketName, objectKey);
};

const initOnInvoicePdfGeneratedUS = () => {
  const orderServiceDS = new OrderServiceDSImpl(new Lambda(), {
    functionName: process.env.GET_ORDER_FUNC_NAME,
    apiKey: process.env.ORDER_SERVICE_API_KEY,
  });
  const orderRepo = new OrderRepositoryImpl(orderServiceDS);

  const mailjet = Mailjet.apiConnect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET);
  const systemEmail = process.env.SYSTEM_EMAIL;
  const emailDS = new MailjetDS(mailjet, systemEmail);
  const emailRepo = new EmailRepositoryImpl(emailDS);

  const fileDS = new S3FileDSImpl(new S3(), { bucketName: process.env.INVOICE_BUCKET });
  const fileRepo = new FileRepositoryImpl(fileDS);

  return new NotificationOnInvoicePdfGeneratedUS(orderRepo, emailRepo, fileRepo);
};

exports.handler = func;
