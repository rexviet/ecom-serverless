import { SQSEvent } from 'aws-lambda';
import { ICdcPaymentCreatedUS, InventoryOnCdcPaymentCreatedUS } from './use-cases/inventoryOnCdcPaymentCreatedUS';
import { IPaymentModel } from '/opt/nodejs/models/payment.model';
import { InventoryRepositoryImpl } from '/opt/nodejs/repositories/inventory.repository';
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
  const repository = new InventoryRepositoryImpl();
  return new InventoryOnCdcPaymentCreatedUS(repository);
};

exports.handler = messageHandler(func);
