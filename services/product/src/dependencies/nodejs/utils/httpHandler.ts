import lambdaWarmer from 'lambda-warmer';
import { AppError } from '../common/app-error';
import { ERROR_CODE } from '../common/codes';
import { connect } from '/opt/nodejs/data-sources/db';

export const requestHandler = (handler: (request: any) => any) => {
  return async (event: any, context: any) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
      if (await lambdaWarmer(event)) return 'warmed';
      await connect();
      return await handler(event);
    } catch (error) {
      console.error('error:', error);
      let err;
      let errors;
      if (error instanceof AppError) {
        err = error.getErrors();
        errors = error.errors;
      } else {
        err = new AppError(ERROR_CODE.SERVER_ERROR, error.message).getErrors();
      }

      return {
        statusCode: err.statusCode,
        body: JSON.stringify({
          message: err.message,
          errors: error.errors,
          errorKey: err.errorCode,
        }),
      };
    }
  };
};
