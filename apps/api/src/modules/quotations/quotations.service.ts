import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { FormulasService } from "../formulas/formulas.service";
import { CreateQuotationDto } from "./dto/create-quotation.dto";
import { Quotation } from "./schemas/quotation.schema";

@Injectable()
export class QuotationsService {
  constructor(
    @InjectModel(Quotation.name) private readonly quotationModel: Model<Quotation>,
    private readonly formulasService: FormulasService
  ) {}

  async create(dto: CreateQuotationDto) {
    const bom = await this.formulasService.generateBom(dto.formulaId, dto.variantCode, dto.parameters);

    return this.quotationModel.create({
      code: dto.code.trim().toUpperCase(),
      customerId: dto.customerId ? new Types.ObjectId(dto.customerId) : undefined,
      formulaId: new Types.ObjectId(dto.formulaId),
      variantCode: dto.variantCode?.trim().toUpperCase(),
      parameters: bom.runtimeParameters,
      bomLines: bom.lines.map((line) => ({
        ...line,
        materialId: new Types.ObjectId(line.materialId)
      })),
      status: "draft"
    });
  }

  async findAll() {
    return this.quotationModel.find().sort({ createdAt: -1 }).lean();
  }
}
