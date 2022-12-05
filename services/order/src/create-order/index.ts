import middy from '@middy/core';
import { Lambda } from 'aws-sdk';
import HttpStatusCode from '/opt/nodejs/common/httpStatusCode';
import { requestHandler } from '/opt/nodejs/utils/httpHandler';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import { InventoryRepositoryImpl } from '/opt/nodejs/repositories/inventory.repository';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { CreateOrderUS, ICreateOrderUS } from './use-cases/createOrderUS';
import { OrderRepositoryImpl } from '/opt/nodejs/repositories/order.repository';
import { InventoryServiceDSImpl } from '/opt/nodejs/data-sources/inventory-service.ds';
import { CreateOrderDetailParams, CreateOrderParams } from './params/create-order.params';

let createOrderUS: ICreateOrderUS;

const func = async (event: APIGatewayProxyEvent) => {
  if (!createOrderUS) {
    createOrderUS = initCreateOrderUS();
  }
  const user_name = event.requestContext.authorizer.claims['cognito:username'];
  console.log('user_name:', user_name);
  // const { body } = event;
  const body: any = event.body as any;
  console.log('body:', body);

  const detailParams = body.detail.map((dt: any) => {
    const quantity = Number(dt.quantity);
    const price = Number(dt.product.price);
    return new CreateOrderDetailParams(dt.product, dt.quantity, quantity * price);
  });
  const params = new CreateOrderParams(user_name, body.address, detailParams);
  console.log('params:', params);
  const order = await createOrderUS.execute(params);
  return {
    statusCode: HttpStatusCode.OK,
    body: JSON.stringify(order),
  };
  //   const res = await createOrderUS.execute(query.sku);
  //   console.log('res:', res);
  //   return {
  //     statusCode: HttpStatusCode.OK,
  //     body: JSON.stringify(res),
  //   };
};

const initCreateOrderUS = () => {
  const repository = new OrderRepositoryImpl();

  const lambda = new Lambda();
  const inventoryServiceDS = new InventoryServiceDSImpl(lambda, {
    functionName: process.env.INCREASE_QUANTITY_FUNC_NAME,
    apiKey: process.env.INVENTORY_SERVICE_API_KEY,
  });
  const inventoryRepository = new InventoryRepositoryImpl(inventoryServiceDS);
  return new CreateOrderUS(repository, inventoryRepository);
};

exports.handler = middy(requestHandler(func)).use(jsonBodyParser()).use(httpErrorHandler());
