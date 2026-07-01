import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateMaterialDto } from "./dto/create-material.dto";
import { UpdateMaterialDto } from "./dto/update-material.dto";
import { MaterialsService } from "./materials.service";

@Controller("materials")
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Post()
  create(@Body() dto: CreateMaterialDto) {
    return this.materialsService.create(dto);
  }

  @Get()
  findAll() {
    return this.materialsService.findAll();
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.materialsService.findById(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateMaterialDto) {
    return this.materialsService.update(id, dto);
  }
}
