import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Material } from "../materials/schemas/material.schema";
import { Warehouse } from "../warehouses/schemas/warehouse.schema";
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
    @InjectModel(Warehouse.name) private readonly warehouseModel: Model<Warehouse>
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

  async listInventory() {
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
          warehouseId: item.warehouseId.toString(),
          warehouseCode: warehouse?.code ?? "",
          warehouseName: warehouse?.name ?? "",
          originalLength: item.originalLength,
          remainingLength: item.remainingLength,
          quantity: item.quantity ?? 1,
          status: item.status
        };
      }),
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
          warehouseId,
          warehouseCode: warehouse?.code ?? "",
          warehouseName: warehouse?.name ?? "",
          quantity: item.quantity
        };
      })
    };
  }
}
