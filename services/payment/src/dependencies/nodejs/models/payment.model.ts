import { PaymentStatus } from '../common/payment.enum';

export interface IPaymentModel {
  readonly id: number;
  readonly order_id: number;
  readonly status: PaymentStatus;
  readonly created_at: Date;
}
