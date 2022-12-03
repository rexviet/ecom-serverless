import { IInventoryModel } from '/opt/nodejs/models/inventory.model';
import { IInventoryRepository } from '/opt/nodejs/repositories/inventory.repository';

export interface IGetInventoryBySkuUS {
  execute(sku: string): Promise<IInventoryModel>;
}

export class GetInventoryBySkuUS implements IGetInventoryBySkuUS {
  constructor(private readonly repository: IInventoryRepository) {}

  public async execute(sku: string): Promise<IInventoryModel> {
    return this.repository.getInventoryBySku(sku);
  }
}
