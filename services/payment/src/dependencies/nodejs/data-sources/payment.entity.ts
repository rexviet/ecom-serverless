import { Entity, PrimaryGeneratedColumn, Index, Column } from 'typeorm';
import { PaymentStatus } from '../common/payment.enum';
import { IPaymentModel } from '../models/payment.model';

@Entity('payments')
export class Payment implements IPaymentModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_payment_order_id')
  @Column({
    type: 'int4',
    nullable: false,
  })
  order_id: number;

  @Index('idx_payment_status')
  @Column({
    type: 'varchar',
    nullable: false,
  })
  status: PaymentStatus;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    precision: null,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    precision: null,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at?: Date;
}
