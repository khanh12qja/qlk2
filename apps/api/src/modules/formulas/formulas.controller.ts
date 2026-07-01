import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateFormulaDto } from "./dto/create-formula.dto";
import { FormulasService } from "./formulas.service";

@Controller("formulas")
export class FormulasController {
  constructor(private readonly formulasService: FormulasService) {}

  @Post()
  create(@Body() dto: CreateFormulaDto) {
    return this.formulasService.create(dto);
  }

  @Get()
  findAll() {
    return this.formulasService.findAll();
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: CreateFormulaDto) {
    return this.formulasService.update(id, dto);
  }

  @Post(":id/generate-bom")
  generateBom(
    @Param("id") id: string,
    @Body() dto: { variantCode?: string; parameters: Record<string, string | number | boolean> }
  ) {
    return this.formulasService.generateBom(id, dto.variantCode, dto.parameters);
  }
}
