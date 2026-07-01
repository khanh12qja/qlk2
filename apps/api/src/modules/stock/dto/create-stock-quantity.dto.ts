import { IsMongoId, IsNumber, Min } from "class-validator";

export class CreateStockQuantityDto {
  @IsMongoId()
  materialId: string;

  @IsMongoId()
  warehouseId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}
