import { Lambda } from 'aws-sdk';
import { AppError } from '../common/app-error';
import { ERROR_CODE } from '../common/codes';
import HttpStatusCode from '../common/httpStatusCode';
import { ILambdaOptions } from '../common/lambdaOptions';
import { IncreaseQuantityPayload } from '../models/payloads/increase-quantity.payload';

export interface IInventoryServiceDS {
  increaseQuantity(payload: IncreaseQuantityPayload): Promise<void>;
}

export class InventoryServiceDSImpl implements IInventoryServiceDS {
  constructor(readonly lambdaClient: Lambda, readonly options: ILambdaOptions) {}

  public async increaseQuantity(payload: IncreaseQuantityPayload): Promise<void> {
    // const lambda = new Lambda({ region: 'ap-southeast-1' });
    const invokeRes = await this.lambdaClient
      .invoke({
        FunctionName: this.options.functionName,
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify({
          body: JSON.stringify(payload.order),
          headers: {
            API_KEY: this.options.apiKey,
          },
        }),
      })
      .promise();
    const resBody = JSON.parse(invokeRes.Payload.toString());
    console.log('resBody:', resBody);
    if (!resBody || resBody.statusCode !== HttpStatusCode.OK) {
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
    return;
  }
}
