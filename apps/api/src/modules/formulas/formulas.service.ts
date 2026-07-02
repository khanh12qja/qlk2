import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateFormulaDto } from "./dto/create-formula.dto";
import { FormulaExpressionService } from "./formula-expression.service";
import { Formula } from "./schemas/formula.schema";

@Injectable()
export class FormulasService {
  constructor(
    @InjectModel(Formula.name) private readonly formulaModel: Model<Formula>,
    private readonly expressions: FormulaExpressionService
  ) {}

  async create(dto: CreateFormulaDto) {
    return this.formulaModel.create(this.buildFormulaPayload(dto));
  }

  async findAll() {
    return this.formulaModel.find().sort({ code: 1 }).lean();
  }

  async update(id: string, dto: CreateFormulaDto) {
    const formula = await this.formulaModel.findByIdAndUpdate(id, this.buildFormulaPayload(dto), {
      new: true,
      runValidators: true
    });

    if (!formula) {
      throw new NotFoundException("Không tìm thấy công thức");
    }

    return formula;
  }

  async generateBom(formulaId: string, variantCode: string | undefined, input: Record<string, string | number | boolean>) {
    const formula = await this.formulaModel.findById(formulaId).lean();
    if (!formula) {
      throw new NotFoundException("Không tìm thấy công thức");
    }

    const variant = variantCode
      ? formula.variants.find((item) => item.code === variantCode.toUpperCase() && item.status === "active")
      : undefined;

    if (variantCode && !variant) {
      throw new NotFoundException("Không tìm thấy biến thể công thức");
    }

    const runtimeParameters = this.buildRuntimeParameters(formula, variant?.parameters ?? {}, input);
    const lines = formula.items
      .filter((item) => this.expressions.evaluateCondition(item.conditionExpression, runtimeParameters))
      .map((item) => ({
        lineCode: item.lineCode,
        materialId: item.materialId.toString(),
        description: item.description,
        length: item.lengthExpression ? this.expressions.evaluateNumber(item.lengthExpression, runtimeParameters) : undefined,
        quantity: this.expressions.evaluateNumber(item.quantityExpression, runtimeParameters, 1),
        wasteRate: item.wasteRate ?? 0
      }));

    return {
      formulaId: formula._id.toString(),
      variantCode: variant?.code,
      runtimeParameters,
      lines
    };
  }

  private buildRuntimeParameters(
    formula: Formula & { parameters: { code: string; required: boolean; defaultValue?: string | number | boolean }[] },
    variantParameters: Record<string, string | number | boolean>,
    input: Record<string, string | number | boolean>
  ) {
    const normalizedInput = this.normalizeParameterKeys(input);
    const normalizedVariant = this.normalizeParameterKeys(variantParameters);
    const runtime: Record<string, string | number | boolean> = {};

    for (const parameter of formula.parameters) {
      const code = parameter.code.toUpperCase();
      const value = normalizedInput[code] ?? normalizedVariant[code] ?? parameter.defaultValue;
      if (parameter.required && value === undefined) {
        throw new BadRequestException(`Thiếu tham số bắt buộc: ${code}`);
      }
      if (value !== undefined) {
        runtime[code] = value;
      }
    }

    return runtime;
  }

  private normalizeParameterKeys(parameters: Record<string, string | number | boolean>) {
    return Object.fromEntries(Object.entries(parameters).map(([key, value]) => [key.toUpperCase(), value]));
  }

  private buildFormulaPayload(dto: CreateFormulaDto) {
    return {
      ...dto,
      code: dto.code.trim().toUpperCase(),
      parameters: dto.parameters.map((parameter) => ({
        ...parameter,
        code: parameter.code.trim().toUpperCase(),
        options:
          parameter.options?.map((option) => ({
            code: option.code.trim().toUpperCase(),
            label: option.label.trim()
          })) ?? []
      })),
      variants: dto.variants.map((variant) => ({
        ...variant,
        code: variant.code.trim().toUpperCase(),
        status: variant.status ?? "active",
        parameters: this.normalizeParameterKeys(variant.parameters)
      })),
      items: dto.items.map((item) => ({
        ...item,
        lineCode: item.lineCode.trim().toUpperCase(),
        wasteRate: item.wasteRate ?? 0
      })),
      status: dto.status ?? "active"
    };
  }
}
