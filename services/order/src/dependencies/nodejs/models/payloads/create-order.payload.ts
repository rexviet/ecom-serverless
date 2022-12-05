import { IProduct } from '../product.model';

export class CreateOrderDetailPayload {
  constructor(readonly product: IProduct, readonly quantity: number, readonly value: number) {}
}
export class CreateOrderPayload {
  constructor(
    readonly user_name: string,
    readonly value: number,
    readonly address: string,
    readonly detail: CreateOrderDetailPayload[]
  ) {}
}
