import { OrderStatus } from '../common/order.enum';
import { IProduct } from './product.model';

export interface IOrderDetail {
  readonly product: IProduct;
  readonly quantity: number;
  readonly value: number;
}

export interface IOrderModel {
  readonly id: number;
  readonly user_name: string;
  readonly value: number;
  readonly address: string;
  readonly status: OrderStatus;
  readonly detail: IOrderDetail[];
  readonly created_at: Date;
  readonly cancel_reason?: string;
}
