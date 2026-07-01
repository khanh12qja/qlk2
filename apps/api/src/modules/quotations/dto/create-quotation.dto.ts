import { IsMongoId, IsObject, IsOptional, IsString } from "class-validator";

export class CreateQuotationDto {
  @IsString()
  code: string;

  @IsOptional()
  @IsMongoId()
  customerId?: string;

  @IsMongoId()
  formulaId: string;

  @IsOptional()
  @IsString()
  variantCode?: string;

  @IsObject()
  parameters: Record<string, string | number | boolean>;
}
