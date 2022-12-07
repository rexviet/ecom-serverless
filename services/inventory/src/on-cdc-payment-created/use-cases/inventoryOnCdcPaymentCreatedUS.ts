import { PaymentStatus } from '/opt/nodejs/common/payment.enum';
import { IncreaseQuantityPayload } from '/opt/nodejs/models/payloads/increase-quantity.payload';
import { IPaymentModel } from '/opt/nodejs/models/payment.model';
import { IInventoryRepository } from '/opt/nodejs/repositories/inventory.repository';

export interface ICdcPaymentCreatedUS {
  execute(payment: IPaymentModel): Promise<void>;
}

export class InventoryOnCdcPaymentCreatedUS implements ICdcPaymentCreatedUS {
  constructor(private readonly repository: IInventoryRepository) {}

  public async execute(payment: IPaymentModel): Promise<void> {
    if (payment.status === PaymentStatus.SUCCESS) {
      return;
    }

    const payloads = payment.order.detail.map((dt) => {
      return new IncreaseQuantityPayload(payment.order.id, dt.product.sku, dt.quantity);
    });
    return this.repository.increaseQuantity(payloads);
    // return this.repository.updateOrderStatus(payment.orderId, OrderStatus.DELIVERING);
  }
}
