import middy from '@middy/core';
import HttpStatusCode from '/opt/nodejs/common/httpStatusCode';
import { requestHandler } from '/opt/nodejs/utils/httpHandler';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import { GetProductsUS, IGetProductsUS } from './use-cases/get-productsUS';
import { ProductRepositoryImpl } from '/opt/nodejs/repositories/product.repository';

let getProductsUS: IGetProductsUS;

const func = async (event: any) => {
  if (!getProductsUS) {
    getProductsUS = initGetProductsUS();
  }
  const body = event.body || {};
  const res = await getProductsUS.execute();
  console.log('res:', res);
  return {
    statusCode: HttpStatusCode.OK,
    body: JSON.stringify(res),
  };
};

const initGetProductsUS = () => {
  const repository = new ProductRepositoryImpl();
  return new GetProductsUS(repository);
};

exports.handler = middy(requestHandler(func)).use(jsonBodyParser()).use(httpErrorHandler());
