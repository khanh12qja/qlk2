import { Type } from "class-transformer";
import { IsArray, IsIn, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";

export class SaveDictionaryItemDto {
  @IsString()
  code: string;

  @IsString()
  label: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsIn(["active", "inactive"])
  status?: string;
}

export class SaveDictionaryDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveDictionaryItemDto)
  items: SaveDictionaryItemDto[];
}
