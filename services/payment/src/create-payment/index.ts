import middy from '@middy/core';
import { SNS, Lambda } from 'aws-sdk';
import HttpStatusCode from '/opt/nodejs/common/httpStatusCode';
import { requestHandler } from '/opt/nodejs/utils/httpHandler';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { ICreatePaymentUS, CreatePaymentUS } from './use-cases/createPaymentUS';
import { PaymentRepositoryImpl } from '/opt/nodejs/repositories/payment.repository';
import { CreatePaymentParams } from './params/create-payment.params';
import { SnsTopicRepositoryImpl } from '/opt/nodejs/repositories/topic.repository';
import { OrderServiceDSImpl } from '/opt/nodejs/data-sources/order-service.ds';
import { OrderRepositoryImpl } from '/opt/nodejs/repositories/order.repository';

let createPaymentUS: ICreatePaymentUS;

const func = async (event: APIGatewayProxyEvent) => {
  if (!createPaymentUS) {
    createPaymentUS = initCreatePaymentUS();
  }

  const body: any = event.body as any;
  // console.log('body:', body);

  const params = new CreatePaymentParams(body.orderId);
  // console.log('params:', params);
  const payment = await createPaymentUS.execute(params);
  return {
    statusCode: HttpStatusCode.CREATED,
    body: JSON.stringify(payment),
  };
};

const initCreatePaymentUS = () => {
  const repository = new PaymentRepositoryImpl();

  const snsClient = new SNS();
  const topicArn = process.env.PAYMENT_CREATED_TOPIC_ARN;
  const topicRepo = new SnsTopicRepositoryImpl(snsClient, topicArn);

  const orderServiceDS = new OrderServiceDSImpl(new Lambda(), {
    functionName: process.env.GET_ORDER_FUNC_NAME,
    apiKey: process.env.ORDER_SERVICE_API_KEY,
  });
  const orderRepo = new OrderRepositoryImpl(orderServiceDS);
  return new CreatePaymentUS(repository, topicRepo, orderRepo);
};

exports.handler = middy(requestHandler(func)).use(jsonBodyParser()).use(httpErrorHandler());
