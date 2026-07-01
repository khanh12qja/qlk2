import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateQuotationDto } from "./dto/create-quotation.dto";
import { QuotationsService } from "./quotations.service";

@Controller("quotations")
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationsService) {}

  @Post()
  create(@Body() dto: CreateQuotationDto) {
    return this.quotationsService.create(dto);
  }

  @Get()
  findAll() {
    return this.quotationsService.findAll();
  }
}
