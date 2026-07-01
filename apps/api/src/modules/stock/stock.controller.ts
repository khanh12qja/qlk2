import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CreateStockBarDto } from "./dto/create-stock-bar.dto";
import { CreateStockQuantityDto } from "./dto/create-stock-quantity.dto";
import { StockService } from "./stock.service";

@Controller("stock")
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post("bars")
  createBar(@Body() dto: CreateStockBarDto) {
    return this.stockService.createBar(dto);
  }

  @Post("quantity")
  createQuantity(@Body() dto: CreateStockQuantityDto) {
    return this.stockService.createQuantity(dto);
  }

  @Get("suitable-bars")
  findSuitableBars(
    @Query("materialId") materialId: string,
    @Query("warehouseId") warehouseId: string,
    @Query("requiredLength") requiredLength: string,
    @Query("requiredQuantity") requiredQuantity?: string
  ) {
    return this.stockService.findSuitableBars(materialId, warehouseId, Number(requiredLength), requiredQuantity ? Number(requiredQuantity) : 1);
  }

  @Get("availability")
  checkAvailability(@Query("materialId") materialId: string, @Query("warehouseId") warehouseId: string) {
    return this.stockService.checkAvailability(materialId, warehouseId);
  }

  @Get("inventory")
  listInventory() {
    return this.stockService.listInventory();
  }
}
