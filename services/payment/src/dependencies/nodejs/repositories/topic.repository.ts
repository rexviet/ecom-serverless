import { SNS } from 'aws-sdk';
import { PaymentCreatedMessage } from '../models/payment-created.message';

export interface ITopicRepository {
  notifyPaymentCreated(message: PaymentCreatedMessage): Promise<void>;
}

export class SnsTopicRepositoryImpl implements ITopicRepository {
  constructor(readonly snsClient: SNS, readonly topicArn: string) {}

  public async notifyPaymentCreated(message: PaymentCreatedMessage): Promise<void> {
    const params: SNS.PublishInput = {
      TopicArn: this.topicArn,
      Message: JSON.stringify(message),
      MessageStructure: 'string',
    };

    await this.snsClient.publish(params).promise();
  }
}
