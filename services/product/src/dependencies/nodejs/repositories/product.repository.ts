import { IProduct } from '../models/product.model';
import { ProductModel } from '../data-sources/product.entity';
import { IListModelRes } from '../models/list-model.res';

export interface IProductRepository {
  getProducts(): Promise<IListModelRes<IProduct>>;
  createProduct(name: string): Promise<IProduct>;
}

export class ProductRepositoryImpl implements IProductRepository {
  public async getProducts(): Promise<IListModelRes<IProduct>> {
    const [data, total] = await Promise.all([ProductModel.find(), ProductModel.count()]);
    return {
      data,
      total,
    };
  }

  public async createProduct(name: string): Promise<IProduct> {
    return ProductModel.create({ name });
  }
}
