import { IncreaseQuantityParams } from 'increase-quantity/params/increase-quantity.params';
import { AppError } from '/opt/nodejs/common/app-error';
import { ERROR_CODE } from '/opt/nodejs/common/codes';
import { IncreaseQuantityPayload } from '/opt/nodejs/models/payloads/increase-quantity.payload';
import { IInventoryRepository } from '/opt/nodejs/repositories/inventory.repository';

export interface IIncreaseQuantityUS {
  execute(params: IncreaseQuantityParams): Promise<void>;
}

export class IncreaseQuantityUS implements IIncreaseQuantityUS {
  constructor(private readonly repository: IInventoryRepository) {}

  public async execute(params: IncreaseQuantityParams): Promise<void> {
    const { detail } = params.order;
    const skus = detail.map((dt) => dt.product.sku);

    const inventories = await this.repository.getInventoriesBySkus(skus);
    const inventoryQuantityMapper: { [sku: string]: number } = {};
    inventories.forEach((inventory) => {
      inventoryQuantityMapper[inventory.sku] = inventory.quantity;
    });

    const payloads: IncreaseQuantityPayload[] = [];
    for (let i = 0; i < detail.length; i++) {
      const { quantity } = detail[i];
      const { sku } = detail[i].product;
      if (!inventoryQuantityMapper[sku] || quantity > inventoryQuantityMapper[sku]) {
        throw new AppError(ERROR_CODE.INSUFFICIENT_QUANTITY, [{ message: `sku: ${sku}, quantity: ${quantity}` }]);
      }

      const payload = new IncreaseQuantityPayload(params.order.id, sku, -quantity);
      payloads.push(payload);
    }

    await this.repository.increaseQuantity(payloads);
  }
}
