import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FormulaExpressionService } from "./formula-expression.service";
import { FormulasController } from "./formulas.controller";
import { FormulasService } from "./formulas.service";
import { Formula, FormulaSchema } from "./schemas/formula.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: Formula.name, schema: FormulaSchema }])],
  controllers: [FormulasController],
  providers: [FormulasService, FormulaExpressionService],
  exports: [FormulasService]
})
export class FormulasModule {}
