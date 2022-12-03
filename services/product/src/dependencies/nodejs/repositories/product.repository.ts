import { IProduct } from '../models/product.model';
import { ProductModel } from '../data-sources/product.entity';
import { IListModelRes } from '../models/list-model.res';

export interface IProductRepository {
  getProducts(): Promise<IListModelRes<IProduct>>;
  createProduct(name: string): Promise<IProduct>;
  getProductById(id: string): Promise<IProduct>;
}

export class ProductRepositoryImpl implements IProductRepository {
  public async getProducts(): Promise<IListModelRes<IProduct>> {
    // await ProductModel.create([
    //   {
    //     _id: '6389ffdba7071e0c13285261',
    //     name: 'shirt',
    //     sku: 'shi-bla-cot-s',
    //     attributes: [
    //       {
    //         size: 's',
    //         color: 'black',
    //         fabric: 'cotton',
    //       },
    //     ],
    //   },
    //   {
    //     _id: '638a0126a7071e0c140b2615',
    //     name: 'shirt',
    //     sku: 'shi-whi-cot-m',
    //     attributes: [
    //       {
    //         size: 'm',
    //         color: 'white',
    //         fabric: 'cotton',
    //       },
    //     ],
    //   },
    //   {
    //     _id: '638a012fa7071e0c140b2616',
    //     name: 'shirt',
    //     sku: 'shi-whi-cot-s',
    //     attributes: [
    //       {
    //         size: 's',
    //         color: 'white',
    //         fabric: 'cotton',
    //       },
    //     ],
    //   },
    //   {
    //     _id: '638a0116a7071e0c140b2614',
    //     name: 'shirt',
    //     sku: 'shi-bla-cot-m',
    //     attributes: [
    //       {
    //         size: 'm',
    //         color: 'black',
    //         fabric: 'cotton',
    //       },
    //     ],
    //   },
    // ]);
    const [data, total] = await Promise.all([ProductModel.find(), ProductModel.count()]);
    return {
      data,
      total,
    };
  }

  public async createProduct(name: string): Promise<IProduct> {
    return ProductModel.create({ name });
  }

  public async getProductById(id: string): Promise<IProduct> {
    return ProductModel.findById(id, {}, { lean: true });
  }
}
