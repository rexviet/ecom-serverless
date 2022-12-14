import HttpStatusCode from './httpStatusCode';

interface IErrorDetails {
  message: string;
  key: string;
  code: string;
}

enum ERROR_CODE {
  SERVER_ERROR = 'SERVER_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  NOT_FOUND = 'NOT_FOUND',
  UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
  UNAUTHORIZED = 'UNAUTHORIZED',
  CONFLICT = 'CONFLICT',
  FORBIDDEN = 'FORBIDDEN',
  ORDER_ID_IS_REQUIRED = 'ORDER_ID_IS_REQUIRED',
}

const ERROR_LIST = {
  [ERROR_CODE.SERVER_ERROR]: {
    code: HttpStatusCode.INTERNAL_SERVER_ERROR,
    error: 'E_SERVER_ERROR',
  },
  [ERROR_CODE.BAD_REQUEST]: {
    code: HttpStatusCode.BAD_REQUEST,
    error: 'E_BAD_REQUEST',
  },
  [ERROR_CODE.NOT_FOUND]: {
    code: HttpStatusCode.NOT_FOUND,
    error: 'E_NOT_FOUND',
  },
  [ERROR_CODE.UNPROCESSABLE_ENTITY]: {
    code: HttpStatusCode.UNPROCESSABLE_ENTITY,
    error: 'E_UNPROCESSABLE_ENTITY',
  },
  [ERROR_CODE.UNAUTHORIZED]: {
    code: HttpStatusCode.UNAUTHORIZED,
    error: 'E_UNAUTHORIZED',
  },
  [ERROR_CODE.CONFLICT]: {
    code: HttpStatusCode.CONFLICT,
    error: 'E_CONFLICT',
  },
  [ERROR_CODE.FORBIDDEN]: {
    code: HttpStatusCode.FORBIDDEN,
    error: 'E_FORBIDDEN',
  },
  [ERROR_CODE.ORDER_ID_IS_REQUIRED]: {
    code: HttpStatusCode.BAD_REQUEST,
    error: 'order id is required',
  },
};

export { IErrorDetails, ERROR_CODE, ERROR_LIST };
