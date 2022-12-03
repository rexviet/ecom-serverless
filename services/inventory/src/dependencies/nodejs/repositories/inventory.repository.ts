import { Repository } from 'typeorm';
import { AppDataSource } from '../data-sources/db';
import { Inventory } from '../data-sources/inventory.entity';
import { IInventoryModel } from '../models/inventory.model';

export interface IInventoryRepository {
  getInventoryBySku(sku: string): Promise<IInventoryModel>;
}

export class InventoryRepositoryImpl implements IInventoryRepository {
  private readonly repository: Repository<Inventory>;

  constructor() {
    this.repository = AppDataSource.getRepository(Inventory);
  }

  public getInventoryBySku(sku: string): Promise<IInventoryModel> {
    return this.repository.createQueryBuilder().where('sku = :sku', { sku }).getOne();
  }
}
