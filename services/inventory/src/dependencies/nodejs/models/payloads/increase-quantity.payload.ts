export class IncreaseQuantityPayload {
  constructor(readonly orderId: number, readonly sku: string, readonly value: number) {}
}
