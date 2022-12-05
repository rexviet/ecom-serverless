import { IInventoryServiceDS } from '../data-sources/inventory-service.ds';
import { IncreaseQuantityPayload } from '../models/payloads/increase-quantity.payload';

export interface IInventoryRepository {
  increaseQuantity(payload: IncreaseQuantityPayload): Promise<void>;
}

export class InventoryRepositoryImpl implements IInventoryRepository {
  constructor(private readonly inventoryServiceDS: IInventoryServiceDS) {}

  public async increaseQuantity(payload: IncreaseQuantityPayload): Promise<void> {
    return this.inventoryServiceDS.increaseQuantity(payload);
  }
}
