import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AppError } from '../common/app-error';
import { ERROR_CODE } from '../common/codes';

export const internalMiddleWare = (): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  const before: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (request): Promise<void> => {
    // Your middleware logic
    const { event } = request;
    if (!event.headers || !event.headers.API_KEY || event.headers.API_KEY !== process.env.API_KEY) {
      throw new AppError(ERROR_CODE.UNAUTHORIZED);
    }
  };

  const after: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (request): Promise<void> => {
    // Your middleware logic
  };

  return {
    before,
    // after,
  };
};
