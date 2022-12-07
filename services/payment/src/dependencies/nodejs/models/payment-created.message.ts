import { PaymentStatus } from '../common/payment.enum';
import { IOrderModel } from './order.model';

export class PaymentCreatedMessage {
  constructor(
    readonly paymentId: number,
    readonly order: IOrderModel,
    readonly status: PaymentStatus,
    readonly created_at: Date
  ) {}
}
