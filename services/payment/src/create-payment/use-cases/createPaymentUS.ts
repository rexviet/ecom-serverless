import { CreatePaymentParams } from 'create-payment/params/create-payment.params';
import { PaymentStatus } from '/opt/nodejs/common/payment.enum';
import { CreatePaymentPayload } from '/opt/nodejs/models/payloads/create-payment.payload';
import { PaymentCreatedMessage } from '/opt/nodejs/models/payment-created.message';
import { IPaymentModel } from '/opt/nodejs/models/payment.model';
import { IOrderRepository } from '/opt/nodejs/repositories/order.repository';
import { IPaymentRepository } from '/opt/nodejs/repositories/payment.repository';
import { ITopicRepository } from '/opt/nodejs/repositories/topic.repository';
import { randomWithPercent } from '/opt/nodejs/utils/funcHelper';

export interface ICreatePaymentUS {
  execute(params: CreatePaymentParams): Promise<IPaymentModel>;
}

export class CreatePaymentUS implements ICreatePaymentUS {
  constructor(
    private readonly repository: IPaymentRepository,
    private readonly topicRepo: ITopicRepository,
    private readonly orderRepo: IOrderRepository
  ) {}

  public async execute(params: CreatePaymentParams): Promise<IPaymentModel> {
    const status = randomWithPercent(70) ? PaymentStatus.SUCCESS : PaymentStatus.FAIL;
    const payload = new CreatePaymentPayload(params.orderId, status);
    const payment = await this.repository.createPayment(payload);
    const order = await this.orderRepo.getOrder(payment.order_id);
    // console.log('order:', order);
    const message = new PaymentCreatedMessage(payment.id, order, payment.status, payment.created_at);
    await this.topicRepo.notifyPaymentCreated(message);

    return payment;
  }
}
