import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { IQuantityHistory } from '../models/quantity-history.model';

@Entity('quantity_history')
export class QuantityHistory implements IQuantityHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_quantity_history_order')
  @Column({
    type: 'int4',
    nullable: false,
  })
  order_id: number;

  @Index('idx_quantity_history_sku')
  @Column({
    type: 'varchar',
    nullable: false,
  })
  sku: string;

  @Column({
    type: 'int4',
    nullable: false,
  })
  value: number;
}
