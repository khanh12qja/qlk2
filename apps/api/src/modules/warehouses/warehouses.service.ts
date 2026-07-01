import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateWarehouseDto } from "./dto/create-warehouse.dto";
import { Warehouse } from "./schemas/warehouse.schema";

@Injectable()
export class WarehousesService {
  constructor(@InjectModel(Warehouse.name) private readonly warehouseModel: Model<Warehouse>) {}

  async create(dto: CreateWarehouseDto) {
    return this.warehouseModel.create({
      ...dto,
      code: dto.code.trim().toUpperCase(),
      status: "active"
    });
  }

  async findAll() {
    return this.warehouseModel.find().sort({ code: 1 }).lean();
  }
}
