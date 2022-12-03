import middy from '@middy/core';
import HttpStatusCode from '/opt/nodejs/common/httpStatusCode';
import { requestHandler } from '/opt/nodejs/utils/httpHandler';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import { ProductRepositoryImpl } from '/opt/nodejs/repositories/product.repository';
import { GetDetailProductUS, IGetDetailProductUS } from './use-cases/getDetailProductUS';
import { PhinHttpClient } from '/opt/nodejs/utils/httpClient';
import { InventoryServiceDSImpl } from '/opt/nodejs/data-sources/inventory-service.ds';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { validatorMiddleWare } from './validators/get-detail-product.validator';

let getDetailProductsUS: IGetDetailProductUS;

const func = async (event: APIGatewayProxyEvent) => {
  if (!getDetailProductsUS) {
    getDetailProductsUS = initGetDetailProductUS();
  }

  const { id } = event.pathParameters;
  const res = await getDetailProductsUS.execute(id);
  console.log('res:', res);
  return {
    statusCode: HttpStatusCode.OK,
    body: JSON.stringify(res),
  };
};

const initGetDetailProductUS = () => {
  const repository = new ProductRepositoryImpl();

  const inventoryServiceClient = new PhinHttpClient(
    process.env.INVENTORY_SERVICE_ENDPOINT,
    process.env.INVENTORY_SERVICE_API_KEY
  );
  const inventoryServiceDS = new InventoryServiceDSImpl(inventoryServiceClient);

  return new GetDetailProductUS(repository, inventoryServiceDS);
};

exports.handler = middy(requestHandler(func)).use(jsonBodyParser()).use(validatorMiddleWare()).use(httpErrorHandler());
