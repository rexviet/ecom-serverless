import { AppError } from '/opt/nodejs/common/app-error';
import { ERROR_CODE } from '/opt/nodejs/common/codes';
import { IProductWithQuantity } from '/opt/nodejs/models/product.model';
import { IInventoryRepository } from '/opt/nodejs/repositories/inventory.repository';
import { IProductRepository } from '/opt/nodejs/repositories/product.repository';

export interface IGetDetailProductUS {
  execute(id: string): Promise<IProductWithQuantity>;
}

export class GetDetailProductUS implements IGetDetailProductUS {
  constructor(private readonly repository: IProductRepository, private readonly inventoryRepo: IInventoryRepository) {}

  public async execute(id: string): Promise<IProductWithQuantity> {
    const product = await this.repository.getProductById(id);
    if (!product) {
      throw new AppError(ERROR_CODE.PRODUCT_NOT_FOUND);
    }

    const inventory = await this.inventoryRepo.getInventoryBySku(product.sku);
    return { ...JSON.parse(JSON.stringify(product)), quantity: inventory?.quantity || 0 };
  }
}
