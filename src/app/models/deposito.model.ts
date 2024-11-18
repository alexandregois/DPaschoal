export interface Warehouse {
  description: string;
  id: number; // hubId
  retailerId: number;
  warehouseType: string | null;
  code: number;
  priceId: number;
  isAntigo?: boolean;
}
