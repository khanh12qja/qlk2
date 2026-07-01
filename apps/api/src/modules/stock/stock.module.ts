import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Material, MaterialSchema } from "../materials/schemas/material.schema";
import { Warehouse, WarehouseSchema } from "../warehouses/schemas/warehouse.schema";
import { StockBar, StockBarSchema } from "./schemas/stock-bar.schema";
import { StockMovement, StockMovementSchema } from "./schemas/stock-movement.schema";
import { StockController } from "./stock.controller";
import { StockService } from "./stock.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Material.name, schema: MaterialSchema },
      { name: StockBar.name, schema: StockBarSchema },
      { name: StockMovement.name, schema: StockMovementSchema },
      { name: Warehouse.name, schema: WarehouseSchema }
    ])
  ],
  controllers: [StockController],
  providers: [StockService]
})
export class StockModule {}
