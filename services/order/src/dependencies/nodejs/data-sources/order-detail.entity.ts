import { Entity, PrimaryGeneratedColumn, Index, Column, JoinColumn, ManyToOne } from 'typeorm';
import { IOrderDetail } from '../models/order.model';
import { IProduct } from '../models/product.model';
import { Order } from './order.entity';

@Entity('order_details')
export class OrderDetail implements IOrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'jsonb',
    nullable: false,
  })
  product: IProduct;

  @Column({
    type: 'int4',
    nullable: false,
  })
  quantity: number;

  @Column({
    type: 'int4',
    nullable: false,
  })
  value: number;

  @Index('idx_order_detail_order')
  @ManyToOne(() => Order, (order) => order.id, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

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
