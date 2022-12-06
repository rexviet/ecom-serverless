import { Repository } from 'typeorm';
import { AppDataSource } from '../data-sources/db';
import { Payment } from '../data-sources/payment.entity';
import { CreatePaymentPayload } from '../models/payloads/create-payment.payload';
import { IPaymentModel } from '../models/payment.model';

export interface IPaymentRepository {
  createPayment(payload: CreatePaymentPayload): Promise<IPaymentModel>;
}

export class PaymentRepositoryImpl implements IPaymentRepository {
  private readonly repository: Repository<Payment>;

  constructor() {
    this.repository = AppDataSource.getRepository(Payment);
  }

  public async createPayment(payload: CreatePaymentPayload): Promise<IPaymentModel> {
    return AppDataSource.transaction(async (entityManager) => {
      const payment = new Payment();
      payment.order_id = payload.orderId;
      payment.status = payload.status;
      return entityManager.save(payment);
    });
  }
}
