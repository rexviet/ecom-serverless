import { AppError } from '/opt/nodejs/common/app-error';
import { ERROR_CODE } from '/opt/nodejs/common/codes';
import { IInventoryServiceDS } from '/opt/nodejs/data-sources/inventory-service.ds';
import { IProductWithQuantity } from '/opt/nodejs/models/product.model';
import { IProductRepository } from '/opt/nodejs/repositories/product.repository';

export interface IGetDetailProductUS {
  execute(id: string): Promise<IProductWithQuantity>;
}

export class GetDetailProductUS implements IGetDetailProductUS {
  constructor(
    private readonly repository: IProductRepository,
    private readonly inventoryServiceDS: IInventoryServiceDS
  ) {}

  public async execute(id: string): Promise<IProductWithQuantity> {
    const product = await this.repository.getProductById(id);
    if (!product) {
      throw new AppError(ERROR_CODE.PRODUCT_NOT_FOUND);
    }

    const inventory = await this.inventoryServiceDS.getInventoryBySku(product.sku);
    return { ...JSON.parse(JSON.stringify(product)), quantity: inventory?.quantity || 0 };
  }
}
