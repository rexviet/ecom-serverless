import { OrderStatus } from '/opt/nodejs/common/order.enum';
import { PaymentStatus } from '/opt/nodejs/common/payment.enum';
import { IPaymentModel } from '/opt/nodejs/models/payment.model';
import { IOrderRepository } from '/opt/nodejs/repositories/order.repository';

export interface ICdcPaymentCreatedUS {
  execute(payment: IPaymentModel): Promise<void>;
}

export class OrderOnCdcPaymentCreatedUS implements ICdcPaymentCreatedUS {
  constructor(private readonly repository: IOrderRepository) {}

  public async execute(payment: IPaymentModel): Promise<void> {
    if (payment.status === PaymentStatus.FAIL) {
      return this.repository.cancelOrder(payment.order.id, 'Canceled due to payment failed');
    }
    return this.repository.updateOrderStatus(payment.order.id, OrderStatus.DELIVERING);
  }
}
