import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany } from 'typeorm';
import { OrderStatus } from '../common/order.enum';
import { IOrderDetail, IOrderModel } from '../models/order.model';
import { OrderDetail } from './order-detail.entity';

@Entity('orders')
export class Order implements IOrderModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_order_user_name')
  @Column({
    type: 'varchar',
    nullable: false,
  })
  user_name: string;

  @Column({
    type: 'int4',
    nullable: false,
  })
  value: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  address: string;

  @Index('idx_order_status')
  @Column({
    type: 'varchar',
    nullable: false,
  })
  status: OrderStatus;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  detail: IOrderDetail[];

  @Column({
    type: 'varchar',
    nullable: true,
  })
  cancel_reason?: string;

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
