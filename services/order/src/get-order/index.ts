import middy from '@middy/core';
import HttpStatusCode from '/opt/nodejs/common/httpStatusCode';
import { requestHandler } from '/opt/nodejs/utils/httpHandler';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import { internalMiddleWare } from '/opt/nodejs/middlewares/internalMiddleware';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { validatorMiddleWare } from './validators/get-order.validator';
import { GetOrderUS, IGetOrderUS } from './use-cases/getOrderUS';
import { OrderRepositoryImpl } from '/opt/nodejs/repositories/order.repository';

let getOrderUS: IGetOrderUS;

const func = async (event: APIGatewayProxyEvent) => {
  if (!getOrderUS) {
    getOrderUS = initGetOrderUS();
  }

  const { id } = event.pathParameters;
  //   console.log('id:', id);

  const res = await getOrderUS.execute(Number(id));
  //   console.log('res:', res);
  return {
    statusCode: HttpStatusCode.OK,
    body: JSON.stringify(res),
  };
};

const initGetOrderUS = () => {
  const repository = new OrderRepositoryImpl();
  return new GetOrderUS(repository);
};

exports.handler = middy(requestHandler(func))
  .use(jsonBodyParser())
  .use(internalMiddleWare())
  .use(validatorMiddleWare())
  .use(httpErrorHandler());
