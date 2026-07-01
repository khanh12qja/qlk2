import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FormulasModule } from "../formulas/formulas.module";
import { QuotationsController } from "./quotations.controller";
import { QuotationsService } from "./quotations.service";
import { Quotation, QuotationSchema } from "./schemas/quotation.schema";

@Module({
  imports: [FormulasModule, MongooseModule.forFeature([{ name: Quotation.name, schema: QuotationSchema }])],
  controllers: [QuotationsController],
  providers: [QuotationsService]
})
export class QuotationsModule {}
