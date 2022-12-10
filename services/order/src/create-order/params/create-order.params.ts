import { IProduct } from '/opt/nodejs/models/product.model';

export class CreateOrderDetailParams {
  constructor(readonly product: IProduct, readonly quantity: number, readonly value: number) {}
}

export class CreateOrderParams {
  constructor(
    readonly user_name: string,
    readonly email: string,
    readonly address: string,
    readonly detail: CreateOrderDetailParams[]
  ) {}
}
