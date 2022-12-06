import HttpStatusCode from './httpStatusCode';
import { ERROR_CODE, ERROR_LIST, IErrorDetails } from './codes';

export class AppError extends Error {
  protected errorCode: ERROR_CODE;
  protected messageError: string;
  protected statusCode: HttpStatusCode;
  errors?: IErrorDetails[];
  additionalData?: any;

  constructor(errorCode: ERROR_CODE, messageError?: string, errors?: IErrorDetails[], additionalData?: any) {
    const error = ERROR_LIST[errorCode] || ERROR_LIST[ERROR_CODE.SERVER_ERROR];
    const message = messageError || error.error;
    super(message);
    this.errorCode = errorCode;
    this.statusCode = error.code;
    this.name = AppError.name;
    this.message = message;
    this.errors = errors || [];
    this.additionalData = additionalData;
    Error.captureStackTrace(this, this.constructor);
  }

  getErrors() {
    return {
      errors: this.errors,
      errorCode: this.errorCode,
      statusCode: this.statusCode,
      message: this.message,
      additionalData: this.additionalData,
    };
  }
}
