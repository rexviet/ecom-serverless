import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { IInventoryModel } from '../models/inventory.model';

@Entity('inventories')
export class Inventory implements IInventoryModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_inventory_sku', { unique: true })
  @Column({
    type: 'varchar',
    nullable: false,
  })
  sku: string;

  @Column({
    type: 'int4',
    nullable: false,
  })
  quantity: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    precision: null,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at?: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    precision: null,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at?: Date;
}
