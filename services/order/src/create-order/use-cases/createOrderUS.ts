import { CreateOrderParams } from 'create-order/params/create-order.params';
import { OrderStatus } from '/opt/nodejs/common/order.enum';
import { IOrderModel } from '/opt/nodejs/models/order.model';
import { CreateOrderDetailPayload, CreateOrderPayload } from '/opt/nodejs/models/payloads/create-order.payload';
import { IncreaseQuantityPayload } from '/opt/nodejs/models/payloads/increase-quantity.payload';
import { IInventoryRepository } from '/opt/nodejs/repositories/inventory.repository';
import { IOrderRepository } from '/opt/nodejs/repositories/order.repository';

export interface ICreateOrderUS {
  execute(params: CreateOrderParams): Promise<IOrderModel>;
}

export class CreateOrderUS implements ICreateOrderUS {
  constructor(
    private readonly repository: IOrderRepository,
    private readonly inventoryRepository: IInventoryRepository
  ) {}

  public async execute(params: CreateOrderParams): Promise<IOrderModel> {
    const order = await this.createOrder(params);
    console.log('order:', order);
    try {
      await this.increaseInventoryQuantity(order);
    } catch (err) {
      await this.repository.cancelOrder(order.id, 'Fail to prepare order');
    }
    await this.repository.updateOrderStatus(order.id, OrderStatus.WAITING_FOR_PAYMENT);
    return order;
  }

  private async createOrder(params: CreateOrderParams): Promise<IOrderModel> {
    const createOrderDetailPayloads: CreateOrderDetailPayload[] = [];

    const orderValue = params.detail.reduce((val, detail) => {
      const payload = new CreateOrderDetailPayload(detail.product, detail.quantity, detail.value);
      createOrderDetailPayloads.push(payload);
      return val + detail.value;
    }, 0);

    const payload = new CreateOrderPayload(
      params.user_name,
      params.email,
      orderValue,
      params.address,
      createOrderDetailPayloads
    );
    const order = await this.repository.createOrder(payload);

    return order;
  }

  private async increaseInventoryQuantity(order: IOrderModel) {
    const payload = new IncreaseQuantityPayload(order);
    console.log('IncreaseQuantityPayload:', payload);
    return this.inventoryRepository.increaseQuantity(payload);
  }
}
