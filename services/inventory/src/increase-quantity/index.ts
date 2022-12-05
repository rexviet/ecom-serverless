import middy from '@middy/core';
import HttpStatusCode from '/opt/nodejs/common/httpStatusCode';
import { requestHandler } from '/opt/nodejs/utils/httpHandler';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import { InventoryRepositoryImpl } from '/opt/nodejs/repositories/inventory.repository';
import { internalMiddleWare } from '/opt/nodejs/middlewares/internalMiddleware';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { IIncreaseQuantityUS, IncreaseQuantityUS } from './use-cases/increaseQuantityUS';
import { IncreaseQuantityParams } from './params/increase-quantity.params';

let increaseQuantityUS: IIncreaseQuantityUS;

const func = async (event: APIGatewayProxyEvent) => {
  if (!increaseQuantityUS) {
    increaseQuantityUS = initIncreaseQuantityUS();
  }

  const order = JSON.parse(event.body);

  const params = new IncreaseQuantityParams(order);
  const res = await increaseQuantityUS.execute(params);
  return {
    statusCode: HttpStatusCode.OK,
    body: JSON.stringify(res),
  };
};

const initIncreaseQuantityUS = () => {
  const repository = new InventoryRepositoryImpl();
  return new IncreaseQuantityUS(repository);
};

exports.handler = middy(requestHandler(func)).use(jsonBodyParser()).use(internalMiddleWare()).use(httpErrorHandler());
