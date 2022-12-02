import { Document, model, Schema } from 'mongoose';
import { IProduct } from '../models/product.model';

const ProductSchema = new Schema({
  name: String,
  sku: {
    type: String,
    index: {
      unique: true,
    },
  },
  attributes: {
    type: Schema.Types.Mixed,
  },
});

export interface IProductDocument extends IProduct, Document {}
// export interface IProductModel extends Model<IProductDocument> {}

export const ProductModel = model<IProductDocument>('product', ProductSchema);
