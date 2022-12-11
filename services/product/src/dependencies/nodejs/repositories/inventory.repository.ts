import { IInventoryServiceDS } from '../data-sources/inventory-service.ds';
import { IInventoryModel } from '../models/inventory.model';

export interface IInventoryRepository {
  getInventoryBySku(sku: string): Promise<IInventoryModel>;
}

export class InventoryRepositoryImpl implements IInventoryRepository {
  constructor(private readonly inventoryServiceDS: IInventoryServiceDS) {}

  public async getInventoryBySku(sku: string): Promise<IInventoryModel> {
    return this.inventoryServiceDS.getInventoryBySku(sku);
  }
}
