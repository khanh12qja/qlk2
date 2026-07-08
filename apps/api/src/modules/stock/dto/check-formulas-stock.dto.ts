import { Type } from "class-transformer";
import { IsArray, IsMongoId, IsNumber, IsObject, IsOptional, IsString, Min, ValidateNested } from "class-validator";

export class CheckFormulaStockRequestDto {
  @IsString()
  formulaCode: string;

  @IsOptional()
  @IsString()
  variantCode?: string;

  @IsNumber()
  @Min(1)
  orderQuantity: number;

  @IsObject()
  parameterValues: Record<string, string>;
}

export class CheckFormulasStockDto {
  @IsMongoId()
  warehouseId: string;

  @IsOptional()
  @IsString()
  glassType?: string;

  @IsOptional()
  @IsString()
  colorCode?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckFormulaStockRequestDto)
  requests: CheckFormulaStockRequestDto[];
}
