import { IsMongoId, IsNumber, IsOptional, Min } from "class-validator";

export class CreateStockBarDto {
  @IsMongoId()
  materialId: string;

  @IsMongoId()
  warehouseId: string;

  @IsNumber()
  @Min(1)
  originalLength: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  remainingLength?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;
}
