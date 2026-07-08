import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { FormulasService } from "../formulas/formulas.service";
import { Formula } from "../formulas/schemas/formula.schema";
import { Material } from "../materials/schemas/material.schema";
import { Warehouse } from "../warehouses/schemas/warehouse.schema";
import { CheckFormulasStockDto } from "./dto/check-formulas-stock.dto";
import { CreateStockBarDto } from "./dto/create-stock-bar.dto";
import { CreateStockQuantityDto } from "./dto/create-stock-quantity.dto";
import { StockBar } from "./schemas/stock-bar.schema";
import { StockMovement } from "./schemas/stock-movement.schema";

@Injectable()
export class StockService {
  constructor(
    @InjectModel(StockBar.name) private readonly stockBarModel: Model<StockBar>,
    @InjectModel(StockMovement.name) private readonly stockMovementModel: Model<StockMovement>,
    @InjectModel(Material.name) private readonly materialModel: Model<Material>,
    @InjectModel(Warehouse.name) private readonly warehouseModel: Model<Warehouse>,
    @InjectModel(Formula.name) private readonly formulaModel: Model<Formula>,
    private readonly formulasService: FormulasService
  ) {}

  async createBar(dto: CreateStockBarDto) {
    const remainingLength = dto.remainingLength ?? dto.originalLength;
    if (remainingLength > dto.originalLength) {
      throw new BadRequestException("Chiều dài còn lại không được lớn hơn chiều dài ban đầu");
    }

    return this.stockBarModel.create({
      materialId: new Types.ObjectId(dto.materialId),
      warehouseId: new Types.ObjectId(dto.warehouseId),
      originalLength: dto.originalLength,
      remainingLength,
      quantity: dto.quantity ?? 1,
      status: "available"
    });
  }

  async createQuantity(dto: CreateStockQuantityDto) {
    return this.stockMovementModel.create({
      materialId: new Types.ObjectId(dto.materialId),
      warehouseId: new Types.ObjectId(dto.warehouseId),
      type: "in",
      quantity: dto.quantity
    });
  }

  async findSuitableBars(materialId: string, warehouseId: string, requiredLength: number, requiredQuantity = 1) {
    if (!Number.isFinite(requiredLength) || requiredLength <= 0) {
      throw new BadRequestException("Chiều dài cần xuất phải lớn hơn 0");
    }
    if (!Number.isFinite(requiredQuantity) || requiredQuantity <= 0) {
      throw new BadRequestException("Số lượng cần xuất phải lớn hơn 0");
    }

    const bars = await this.stockBarModel
      .find({
        materialId: new Types.ObjectId(materialId),
        warehouseId: new Types.ObjectId(warehouseId),
        status: "available",
        remainingLength: { $gte: requiredLength }
      })
      .sort({ remainingLength: 1 })
      .lean();

    const availableQuantity = bars.reduce((total, bar) => total + (bar.quantity ?? 1), 0);

    return {
      materialId,
      warehouseId,
      requiredLength,
      requiredQuantity,
      suitableCount: availableQuantity,
      enoughQuantity: availableQuantity >= requiredQuantity,
      bars: bars.map((bar) => ({
        ...bar,
        quantity: bar.quantity ?? 1,
        leftoverAfterCut: bar.remainingLength - requiredLength
      }))
    };
  }

  async checkAvailability(materialId: string, warehouseId: string) {
    const [bars, movements] = await Promise.all([
      this.stockBarModel
        .find({
          materialId: new Types.ObjectId(materialId),
          warehouseId: new Types.ObjectId(warehouseId),
          status: "available"
        })
        .sort({ remainingLength: -1 })
        .lean(),
      this.stockMovementModel
        .aggregate([
          {
            $match: {
              materialId: new Types.ObjectId(materialId),
              warehouseId: new Types.ObjectId(warehouseId)
            }
          },
          {
            $group: {
              _id: "$materialId",
              quantity: { $sum: "$quantity" }
            }
          }
        ])
    ]);

    return {
      materialId,
      warehouseId,
      availableBars: bars,
      quantityBalance: movements[0]?.quantity ?? 0
    };
  }

  async listInventory(glassType?: string) {
    const [barStocks, quantityStocks, materials, warehouses] = await Promise.all([
      this.stockBarModel.find({ status: "available" }).sort({ createdAt: -1 }).lean(),
      this.stockMovementModel.aggregate([
        {
          $group: {
            _id: {
              materialId: "$materialId",
              warehouseId: "$warehouseId"
            },
            quantity: { $sum: "$quantity" }
          }
        },
        {
          $match: {
            quantity: { $gt: 0 }
          }
        }
      ]),
      this.materialModel.find().lean(),
      this.warehouseModel.find().lean()
    ]);

    const materialMap = new Map(materials.map((item) => [item._id.toString(), item]));
    const warehouseMap = new Map(warehouses.map((item) => [item._id.toString(), item]));

    const selectedGlassType = this.normalizeGlassType(glassType);

    return {
      barStocks: barStocks.map((item) => {
        const material = materialMap.get(item.materialId.toString());
        const warehouse = warehouseMap.get(item.warehouseId.toString());
        return {
          id: item._id.toString(),
          materialId: item.materialId.toString(),
          materialCode: material?.code ?? "",
          materialName: material?.name ?? "",
          colorCode: material?.colorCode,
          colorName: material?.colorName,
          useGlass: material?.useGlass ?? Boolean(material?.glassType),
          glassType: material?.glassType ?? "GLASS_12",
          warehouseId: item.warehouseId.toString(),
          warehouseCode: warehouse?.code ?? "",
          warehouseName: warehouse?.name ?? "",
          originalLength: item.originalLength,
          remainingLength: item.remainingLength,
          quantity: item.quantity ?? 1,
          status: item.status
        };
      }).filter((item) => this.supportsGlassType(item.useGlass, item.glassType, selectedGlassType)),
      quantityStocks: quantityStocks.map((item) => {
        const materialId = item._id.materialId.toString();
        const warehouseId = item._id.warehouseId.toString();
        const material = materialMap.get(materialId);
        const warehouse = warehouseMap.get(warehouseId);
        return {
          materialId,
          materialCode: material?.code ?? "",
          materialName: material?.name ?? "",
          colorCode: material?.colorCode,
          colorName: material?.colorName,
          useGlass: material?.useGlass ?? Boolean(material?.glassType),
          glassType: material?.glassType ?? "GLASS_12",
          warehouseId,
          warehouseCode: warehouse?.code ?? "",
          warehouseName: warehouse?.name ?? "",
          quantity: item.quantity
        };
      }).filter((item) => this.supportsGlassType(item.useGlass, item.glassType, selectedGlassType))
    };
  }

  async checkFormulas(dto: CheckFormulasStockDto) {
    const activeRows = (dto.requests ?? []).filter((row) => row.formulaCode?.trim());
    if (!dto.warehouseId) {
      throw new BadRequestException("Chon kho can kiem tra.");
    }
    if (activeRows.length === 0) {
      throw new BadRequestException("Nhap it nhat mot ma cong thuc.");
    }

    const materials = await this.materialModel.find().lean();
    const materialMap = new Map(materials.map((item) => [item._id.toString(), item]));
    const aggregated = new Map<
      string,
      {
        materialId: string;
        materialCode: string;
        materialName: string;
        category: string;
        baseCode?: string;
        colorCode?: string;
        manageLength?: boolean;
        useGlass?: boolean;
        glassType?: string;
        unit: string;
        requiredQuantity: number;
        requiredLength?: number;
        sources: string[];
      }
    >();
    const formulaSummaries: Array<{
      formulaCode: string;
      formulaName: string;
      orderQuantity: number;
      variantCode?: string;
    }> = [];

    for (const row of activeRows) {
      const formulaCode = this.normalizeCode(row.formulaCode);
      const formula = await this.formulaModel.findOne({ code: formulaCode }).lean();
      if (!formula) {
        throw new NotFoundException(`Khong tim thay cong thuc ${row.formulaCode}.`);
      }

      const parameters = this.buildFormulaParameters(formula, row.parameterValues ?? {});
      const orderQuantity = Number(row.orderQuantity || 1);
      if (!Number.isFinite(orderQuantity) || orderQuantity <= 0) {
        throw new BadRequestException("So luong bo phai lon hon 0.");
      }

      const targetVariants = row.variantCode
        ? formula.variants.filter((variant) => variant.code === row.variantCode)
        : formula.variants.length > 0
          ? formula.variants.filter((variant) => this.matchesVariantWithParameters(variant.parameters, parameters))
          : [undefined];
      const variantsToRun = targetVariants.length > 0 ? targetVariants : [undefined];

      for (const variant of variantsToRun) {
        const bom = await this.formulasService.generateBom(formula._id.toString(), variant?.code, parameters);

        formulaSummaries.push({
          formulaCode: formula.code,
          formulaName: formula.name,
          orderQuantity,
          variantCode: variant?.code
        });

        for (const line of bom.lines) {
          const material = materialMap.get(line.materialId);
          if (!material) {
            continue;
          }

          const requiredQuantity = line.quantity * orderQuantity;
          const requiredLength = material.manageLength ? line.length ?? material.standardLength : undefined;
          const key = material.manageLength ? `${line.materialId}:${requiredLength ?? 0}` : line.materialId;
          const sourceLabel = `${formula.code}${variant?.code ? ` (${variant.code})` : ""} x ${orderQuantity}`;
          const current = aggregated.get(key);

          if (current) {
            current.requiredQuantity += requiredQuantity;
            if (!current.sources.includes(sourceLabel)) {
              current.sources.push(sourceLabel);
            }
          } else {
            aggregated.set(key, {
              materialId: line.materialId,
              materialCode: material.code,
              materialName: material.name,
              category: material.category,
              baseCode: material.baseCode,
              colorCode: material.colorCode,
              manageLength: material.manageLength,
              useGlass: material.useGlass ?? Boolean(material.glassType),
              glassType: material.glassType,
              unit: material.unit,
              requiredQuantity,
              requiredLength,
              sources: [sourceLabel]
            });
          }
        }
      }
    }

    const materialChecks = await Promise.all(
      Array.from(aggregated.values()).map(async (item) => {
        const selectedGlassType = this.normalizeGlassType(dto.glassType);
        const selectedColorCode = dto.colorCode?.trim().toUpperCase();
        const candidateMaterials = this.findCompatibleMaterials(materials, item, selectedGlassType, selectedColorCode);
        if (candidateMaterials.length === 0) {
          return {
            materialId: item.materialId,
            materialCode: item.materialCode,
            materialName: item.materialName,
            unit: item.unit,
            requiredQuantity: item.requiredQuantity,
            requiredLength: item.requiredLength,
            availableQuantity: 0,
            enough: false,
            sources: item.sources
          };
        }

        if (item.requiredLength && item.requiredLength > 0) {
          const suitableResults = await Promise.all(
            candidateMaterials.map((material) =>
              this.findSuitableBars(material._id.toString(), dto.warehouseId, item.requiredLength as number, item.requiredQuantity)
            )
          );
          const availableQuantity = suitableResults.reduce((sum, suitable) => sum + suitable.suitableCount, 0);

          return {
            materialId: item.materialId,
            materialCode: item.materialCode,
            materialName: item.materialName,
            unit: item.unit,
            requiredQuantity: item.requiredQuantity,
            requiredLength: item.requiredLength,
            availableQuantity,
            enough: availableQuantity >= item.requiredQuantity,
            sources: item.sources,
            cutNotice: candidateMaterials.length === 1 ? this.buildCutNotice(suitableResults[0]) : undefined,
            cutPlan: candidateMaterials.length === 1 ? this.buildCutPlanRows(suitableResults[0]) : undefined
          };
        }

        const availabilityResults = await Promise.all(
          candidateMaterials.map((material) => this.checkAvailability(material._id.toString(), dto.warehouseId))
        );
        const quantityBalance = availabilityResults.reduce((sum, availability) => sum + availability.quantityBalance, 0);

        return {
          materialId: item.materialId,
          materialCode: item.materialCode,
          materialName: item.materialName,
          unit: item.unit,
          requiredQuantity: item.requiredQuantity,
          availableQuantity: quantityBalance,
          enough: quantityBalance >= item.requiredQuantity,
          sources: item.sources
        };
      })
    );

    return { formulaSummaries, materialChecks };
  }

  private buildFormulaParameters(
    formula: Formula & { parameters: Array<{ code: string; type: string }> },
    values: Record<string, string>
  ) {
    return Object.fromEntries(
      formula.parameters
        .filter((parameter) => values[parameter.code] !== undefined && values[parameter.code] !== "")
        .map((parameter) => [parameter.code, this.parseParameterValue(parameter.type, values[parameter.code])])
    );
  }

  private parseParameterValue(type: string, value: string) {
    if (type === "number") {
      return Number(value);
    }
    if (type === "boolean") {
      return value === "true";
    }
    return value;
  }

  private matchesVariantWithParameters(
    variantParameters: Record<string, string | number | boolean>,
    runtimeParameters: Record<string, string | number | boolean>
  ) {
    return Object.entries(runtimeParameters).every(([key, value]) => {
      if (variantParameters[key] === undefined) {
        return true;
      }

      return String(variantParameters[key]) === String(value);
    });
  }

  private buildCutNotice(suitable: Awaited<ReturnType<StockService["findSuitableBars"]>>) {
    if (suitable.requiredLength <= 0 || suitable.requiredQuantity <= 0) {
      return undefined;
    }

    const targetQuantity = suitable.enoughQuantity
      ? suitable.requiredQuantity
      : Math.min(suitable.requiredQuantity, suitable.suitableCount);
    const selectedBars = this.selectBarsForCut(suitable.bars, targetQuantity);
    if (selectedBars.length === 0) {
      return undefined;
    }

    const totalLeftover = selectedBars.reduce((sum, length) => sum + Math.max(length - suitable.requiredLength, 0), 0);
    const sample = selectedBars
      .slice(0, 3)
      .map((length) => `${length} -> du ${this.formatLengthAsCentimeters(length - suitable.requiredLength)}`)
      .join("; ");
    const moreCount = selectedBars.length - Math.min(selectedBars.length, 3);

    if (!suitable.enoughQuantity) {
      return `Chua du so thanh. Hien co ${selectedBars.length}/${suitable.requiredQuantity} thanh co the cat, du kien cat bo ${this.formatLengthAsCentimeters(totalLeftover)}. ${sample}${moreCount > 0 ? `; va ${moreCount} thanh khac` : ""}`;
    }

    if (totalLeftover <= 0) {
      return "Cat vua du, khong du.";
    }

    return `Du nho cat thanh dai hon. Can cat bo tong ${this.formatLengthAsCentimeters(totalLeftover)} tren ${selectedBars.length} thanh. ${sample}${moreCount > 0 ? `; va ${moreCount} thanh khac` : ""}`;
  }

  private buildCutPlanRows(suitable: Awaited<ReturnType<StockService["findSuitableBars"]>>) {
    if (suitable.requiredLength <= 0 || suitable.requiredQuantity <= 0) {
      return [];
    }

    const targetQuantity = suitable.enoughQuantity
      ? suitable.requiredQuantity
      : Math.min(suitable.requiredQuantity, suitable.suitableCount);

    return this.selectBarsForCut(suitable.bars, targetQuantity).map((sourceLength) => ({
      sourceLength,
      cutLength: suitable.requiredLength,
      leftoverLength: Math.max(sourceLength - suitable.requiredLength, 0)
    }));
  }

  private selectBarsForCut(bars: Array<{ remainingLength: number; quantity?: number }>, requiredQuantity: number) {
    const selected: number[] = [];

    for (const bar of bars) {
      const count = Math.max(bar.quantity ?? 0, 0);
      for (let index = 0; index < count && selected.length < requiredQuantity; index += 1) {
        selected.push(bar.remainingLength);
      }
      if (selected.length >= requiredQuantity) {
        break;
      }
    }

    return selected;
  }

  private formatLengthAsCentimeters(length: number) {
    if (!Number.isFinite(length)) {
      return "0 cm";
    }

    return `${Math.round(length / 10)} cm`;
  }

  private normalizeCode(value: string) {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Za-z0-9_]/g, "_")
      .replace(/_+/g, "_")
      .toUpperCase();
  }

  private normalizeGlassType(value?: string) {
    const normalized = value?.trim().toUpperCase();
    return normalized && ["GLASS_8", "GLASS_10", "GLASS_12"].includes(normalized) ? normalized : undefined;
  }

  private findCompatibleMaterials(
    materials: Array<Material & { _id: { toString(): string } }>,
    item: {
      category: string;
      baseCode?: string;
      colorCode?: string;
      useGlass?: boolean;
      glassType?: string;
      manageLength?: boolean;
      unit: string;
    },
    selectedGlassType?: string,
    selectedColorCode?: string
  ) {
    const baseCode = item.baseCode?.trim().toUpperCase();
    const itemColorCode = item.colorCode?.trim().toUpperCase();

    return materials.filter((material) => {
      if (material.category !== item.category || material.unit !== item.unit || material.manageLength !== item.manageLength) {
        return false;
      }

      const materialBaseCode = material.baseCode?.trim().toUpperCase();
      if (baseCode && materialBaseCode !== baseCode && !materialBaseCode?.startsWith(baseCode)) {
        return false;
      }

      const materialColorCode = material.colorCode?.trim().toUpperCase();
      if (selectedColorCode && materialColorCode && materialColorCode !== selectedColorCode) {
        return false;
      }
      if (!selectedColorCode && itemColorCode && materialColorCode !== itemColorCode) {
        return false;
      }

      return this.supportsGlassType(material.useGlass ?? Boolean(material.glassType), material.glassType, selectedGlassType);
    });
  }

  private supportsGlassType(useGlass: boolean | undefined, materialGlassType?: string, selectedGlassType?: string) {
    if (!selectedGlassType) {
      return true;
    }
    if (!useGlass) {
      return true;
    }

    const rank: Record<string, number> = {
      GLASS_8: 1,
      GLASS_10: 2,
      GLASS_12: 3
    };

    return (rank[materialGlassType ?? "GLASS_12"] ?? rank.GLASS_12) >= rank[selectedGlassType];
  }
}
