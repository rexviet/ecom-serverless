import { IListModelRes } from '/opt/nodejs/models/list-model.res';
import { IProduct } from '/opt/nodejs/models/product.model';
import { IProductRepository } from '/opt/nodejs/repositories/product.repository';

export interface IGetProductsUS {
  execute(): Promise<IListModelRes<IProduct>>;
}

export class GetProductsUS implements IGetProductsUS {
  constructor(private readonly repository: IProductRepository) {}

  public async execute(): Promise<IListModelRes<IProduct>> {
    return this.repository.getProducts();
  }
}
