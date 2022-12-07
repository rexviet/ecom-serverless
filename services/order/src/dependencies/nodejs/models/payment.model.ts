import { PaymentStatus } from '../common/payment.enum';

export interface IPaymentModel {
  readonly id: number;
  readonly orderId: number;
  readonly status: PaymentStatus;
  readonly created_at: Date;
}
