import { Lambda } from 'aws-sdk';
import { AppError } from '../common/app-error';
import { ERROR_CODE } from '../common/codes';
import HttpStatusCode from '../common/httpStatusCode';
import { ILambdaOptions } from '../common/lambdaOptions';
import { IOrderModel } from '../models/order.model';

export interface IOrderServiceDS {
  getOrder(id: number): Promise<IOrderModel>;
}

export class OrderServiceDSImpl implements IOrderServiceDS {
  constructor(readonly lambdaClient: Lambda, readonly options: ILambdaOptions) {}

  public async getOrder(id: number): Promise<IOrderModel> {
    // const lambda = new Lambda({ region: 'ap-southeast-1' });
    const invokeRes = await this.lambdaClient
      .invoke({
        FunctionName: this.options.functionName,
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify({
          pathParameters: { id },
          headers: {
            API_KEY: this.options.apiKey,
          },
        }),
      })
      .promise();
    const resBody = JSON.parse(invokeRes.Payload.toString());
    // console.log('resBody:', resBody);
    if (!resBody || resBody.statusCode !== HttpStatusCode.OK) {
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }

    if (resBody.body === 'null') {
      throw new AppError(ERROR_CODE.ORDER_NOT_EXISTS);
    }

    return JSON.parse(resBody.body);
  }
}
