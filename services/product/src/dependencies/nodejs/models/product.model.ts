export interface IProduct {
  readonly name: string;
  readonly sku: string;
  readonly price: number;
  readonly attributes: any;
}

export interface IProductWithQuantity extends IProduct {
  readonly quantity: number;
}
