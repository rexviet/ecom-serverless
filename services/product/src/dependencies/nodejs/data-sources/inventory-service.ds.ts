import { IInventoryModel } from '../models/inventory.model';
import { HttpClient } from '../utils/httpClient';
import { Lambda } from 'aws-sdk';
import HttpStatusCode from '../common/httpStatusCode';

export interface IInventoryServiceDS {
  getInventoryBySku(sku: string): Promise<IInventoryModel>;
}

export class InventoryServiceDSImpl implements IInventoryServiceDS {
  constructor(private readonly inventoryServiceClient: HttpClient) {}

  public async getInventoryBySku(sku: string): Promise<IInventoryModel> {
    const lambda = new Lambda({ region: 'ap-southeast-1' });
    const invokeRes = await lambda
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
