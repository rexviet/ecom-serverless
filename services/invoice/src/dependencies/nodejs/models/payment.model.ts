import { PaymentStatus } from '../common/payment.enum';
import { IOrderModel } from './order.model';

export interface IPaymentModel {
  readonly id: number;
  readonly order: IOrderModel;
  readonly status: PaymentStatus;
  readonly created_at: Date;
}
