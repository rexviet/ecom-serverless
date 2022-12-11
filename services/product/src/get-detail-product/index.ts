import middy from '@middy/core';
import { Lambda } from 'aws-sdk';
import HttpStatusCode from '/opt/nodejs/common/httpStatusCode';
import { requestHandler } from '/opt/nodejs/utils/httpHandler';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import { ProductRepositoryImpl } from '/opt/nodejs/repositories/product.repository';
import { GetDetailProductUS, IGetDetailProductUS } from './use-cases/getDetailProductUS';
import { InventoryServiceDSImpl } from '/opt/nodejs/data-sources/inventory-service.ds';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { validatorMiddleWare } from './validators/get-detail-product.validator';
import { InventoryRepositoryImpl } from '/opt/nodejs/repositories/inventory.repository';

let getDetailProductsUS: IGetDetailProductUS;

const func = async (event: APIGatewayProxyEvent) => {
  if (!getDetailProductsUS) {
    getDetailProductsUS = initGetDetailProductUS();
  }

  const { id } = event.pathParameters;
  const res = await getDetailProductsUS.execute(id);
  return {
    statusCode: HttpStatusCode.OK,
    body: JSON.stringify(res),
  };
};

const initGetDetailProductUS = () => {
  const repository = new ProductRepositoryImpl();

  const lambda = new Lambda();
  const inventoryServiceDS = new InventoryServiceDSImpl(lambda, {
    functionName: process.env.INCREASE_QUANTITY_FUNC_NAME,
    apiKey: process.env.INVENTORY_SERVICE_API_KEY,
  });
  const inventoryRepository = new InventoryRepositoryImpl(inventoryServiceDS);

  return new GetDetailProductUS(repository, inventoryRepository);
};

exports.handler = middy(requestHandler(func)).use(jsonBodyParser()).use(validatorMiddleWare()).use(httpErrorHandler());
