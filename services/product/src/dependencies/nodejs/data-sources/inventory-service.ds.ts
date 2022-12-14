import { IInventoryModel } from '../models/inventory.model';
import { Lambda } from 'aws-sdk';
import HttpStatusCode from '../common/httpStatusCode';
import { ILambdaOptions } from '../common/lambdaOptions';

export interface IInventoryServiceDS {
  getInventoryBySku(sku: string): Promise<IInventoryModel>;
}

export class InventoryServiceDSImpl implements IInventoryServiceDS {
  constructor(readonly lambdaClient: Lambda, readonly options: ILambdaOptions) {}

  public async getInventoryBySku(sku: string): Promise<IInventoryModel> {
    const invokeRes = await this.lambdaClient
      .invoke({
        FunctionName: 'default_get-inven-by-sku',
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify({
          queryStringParameters: {
            sku,
          },
          headers: {
            API_KEY: 'LMaNENtJlNHVml2j',
          },
        }),
      })
      .promise();
    const resBody = JSON.parse(invokeRes.Payload.toString());
    if (!resBody || resBody.statusCode !== HttpStatusCode.OK) {
      return null;
    }
    return JSON.parse(resBody.body);
  }
}
