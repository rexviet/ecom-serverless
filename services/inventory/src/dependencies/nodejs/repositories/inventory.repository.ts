/* eslint-disable no-await-in-loop */
import { Repository } from 'typeorm';
import { AppDataSource } from '../data-sources/db';
import { Inventory } from '../data-sources/inventory.entity';
import { QuantityHistory } from '../data-sources/quantity-history.entity';
import { IInventoryModel } from '../models/inventory.model';
import { IncreaseQuantityPayload } from '../models/payloads/increase-quantity.payload';

export interface IInventoryRepository {
  getInventoryBySku(sku: string): Promise<IInventoryModel>;
  getInventoriesBySkus(skus: string[]): Promise<IInventoryModel[]>;
  increaseQuantity(payloads: IncreaseQuantityPayload[]): Promise<void>;
}

export class InventoryRepositoryImpl implements IInventoryRepository {
  private readonly repository: Repository<Inventory>;

  constructor() {
    this.repository = AppDataSource.getRepository(Inventory);
  }

  public async getInventoryBySku(sku: string): Promise<IInventoryModel> {
    return this.repository.createQueryBuilder().where('sku = :sku', { sku }).getOne();
  }

  public async getInventoriesBySkus(skus: string[]): Promise<IInventoryModel[]> {
    return this.repository.createQueryBuilder().where('sku IN (:...skus)', { skus }).getMany();
  }

  public async increaseQuantity(payloads: IncreaseQuantityPayload[]): Promise<void> {
    return AppDataSource.transaction(async (entityManager) => {
      for (let i = 0; i < payloads.length; i++) {
        const payload = payloads[i];
        await entityManager
          .createQueryBuilder()
          .update(Inventory)
          .set({ quantity: () => `quantity + ${payload.value}` })
          .where('sku = :sku', { sku: payload.sku })
          .execute();

        const quantityHistory = new QuantityHistory();
        quantityHistory.order_id = payload.orderId;
        quantityHistory.sku = payload.sku;
        quantityHistory.value = payload.value;
        await entityManager.save(quantityHistory);
      }
    });
  }
}
