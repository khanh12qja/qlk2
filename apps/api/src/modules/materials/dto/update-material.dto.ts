import { IsBoolean, IsIn, IsNumber, IsOptional, IsString, Min, ValidateIf } from "class-validator";

export class UpdateMaterialDto {
  @IsOptional()
  @IsString()
  baseCode?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  colorCode?: string;

  @IsOptional()
  @IsString()
  colorName?: string;

  @IsOptional()
  @IsBoolean()
  useGlass?: boolean;

  @IsOptional()
  @IsIn(["GLASS_8", "GLASS_10", "GLASS_12"])
  glassType?: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsBoolean()
  manageLength?: boolean;

  @ValidateIf((dto: UpdateMaterialDto) => dto.manageLength === true)
  @IsNumber()
  @Min(1)
  standardLength?: number;

  @IsOptional()
  @IsIn(["active", "inactive"])
  status?: string;
}
