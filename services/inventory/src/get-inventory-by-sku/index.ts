import middy from '@middy/core';
import HttpStatusCode from '/opt/nodejs/common/httpStatusCode';
import { requestHandler } from '/opt/nodejs/utils/httpHandler';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import { GetInventoryBySkuUS, IGetInventoryBySkuUS } from './use-cases/getInventoryBySkuUS';
import { InventoryRepositoryImpl } from '/opt/nodejs/repositories/inventory.repository';
import { internalMiddleWare } from '/opt/nodejs/middlewares/internalMiddleware';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { validatorMiddleWare } from './validators/get-inventory-by-sku.validator';

let getInventoryBySkuUS: IGetInventoryBySkuUS;

const func = async (event: APIGatewayProxyEvent) => {
  if (!getInventoryBySkuUS) {
    getInventoryBySkuUS = initGetInventoryBySkuUS();
  }
  event.queryStringParameters;
  const query = event.queryStringParameters || {};
  console.log('query:', query);

  const res = await getInventoryBySkuUS.execute(query.sku);
  console.log('res:', res);
  return {
    statusCode: HttpStatusCode.OK,
    body: JSON.stringify(res),
  };
};

const initGetInventoryBySkuUS = () => {
  const repository = new InventoryRepositoryImpl();
  return new GetInventoryBySkuUS(repository);
};

exports.handler = middy(requestHandler(func))
  .use(jsonBodyParser())
  .use(internalMiddleWare())
  .use(validatorMiddleWare())
  .use(httpErrorHandler());
