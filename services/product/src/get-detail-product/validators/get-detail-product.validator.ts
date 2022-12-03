import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AppError } from '/opt/nodejs/common/app-error';
import { ERROR_CODE } from '/opt/nodejs/common/codes';

export const validatorMiddleWare = (): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  const before: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (request): Promise<void> => {
    // Your middleware logic
    const { event } = request;
    if (!event.pathParameters || !event.pathParameters.id) {
      throw new AppError(ERROR_CODE.ID_IS_REQUIRED);
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
