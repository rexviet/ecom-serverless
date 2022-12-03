export class InventoryServiceEndpoint {
  public static buildGetInventoryBySkuPath = (sku: string) => `?sku=${sku}`;
}
