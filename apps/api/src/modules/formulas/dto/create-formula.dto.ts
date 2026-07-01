import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsMongoId,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested
} from "class-validator";

export class FormulaParameterDto {
  @IsString()
  code: string;

  @IsString()
  label: string;

  @IsIn(["number", "text", "select", "boolean"])
  type: string;

  @IsBoolean()
  required: boolean;

  @IsOptional()
  @IsString()
  optionsDictionaryCode?: string;

  @IsOptional()
  @IsArray()
  options?: { code: string; label: string }[];
}

export class FormulaVariantDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  nameTemplate?: string;

  @IsObject()
  parameters: Record<string, string | number | boolean>;

  @IsOptional()
  @IsIn(["active", "inactive"])
  status?: string;
}

export class FormulaItemDto {
  @IsString()
  lineCode: string;

  @IsMongoId()
  materialId: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  lengthExpression?: string;

  @IsString()
  quantityExpression: string;

  @IsOptional()
  @IsString()
  conditionExpression?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  wasteRate?: number;
}

export class CreateFormulaDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormulaParameterDto)
  parameters: FormulaParameterDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormulaVariantDto)
  variants: FormulaVariantDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormulaItemDto)
  items: FormulaItemDto[];

  @IsOptional()
  @IsIn(["active", "inactive"])
  status?: string;
}
