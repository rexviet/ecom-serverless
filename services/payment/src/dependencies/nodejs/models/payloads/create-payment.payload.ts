import { PaymentStatus } from '../../common/payment.enum';

export class CreatePaymentPayload {
  constructor(readonly orderId: number, readonly status: PaymentStatus) {}
}
