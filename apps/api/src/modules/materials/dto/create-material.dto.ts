import { IsBoolean, IsIn, IsNumber, IsOptional, IsString, Min, ValidateIf } from "class-validator";

export class CreateMaterialDto {
  @IsString()
  baseCode: string;

  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  colorCode?: string;

  @IsOptional()
  @IsString()
  colorName?: string;

  @IsString()
  unit: string;

  @IsBoolean()
  manageLength: boolean;

  @ValidateIf((dto: CreateMaterialDto) => dto.manageLength)
  @IsNumber()
  @Min(1)
  standardLength?: number;

  @IsOptional()
  @IsIn(["active", "inactive"])
  status?: string;
}
