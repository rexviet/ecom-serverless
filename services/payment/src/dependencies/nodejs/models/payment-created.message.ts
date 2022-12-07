import { PaymentStatus } from '../common/payment.enum';

export class PaymentCreatedMessage {
  constructor(
    readonly paymentId: number,
    readonly orderId: number,
    readonly status: PaymentStatus,
    readonly created_at: Date
  ) {}
}
