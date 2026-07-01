import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { BaseSchema } from "../../../shared/schemas/base.schema";

export type StockBarDocument = HydratedDocument<StockBar>;

@Schema({ collection: "stock_bars", timestamps: true })
export class StockBar extends BaseSchema {
  @Prop({ type: Types.ObjectId, ref: "Material", required: true, index: true })
  materialId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Warehouse", required: true, index: true })
  warehouseId: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  originalLength: number;

  @Prop({ required: true, min: 0, index: true })
  remainingLength: number;

  @Prop({ required: true, min: 1, default: 1 })
  quantity: number;

  @Prop({ required: true, enum: ["available", "reserved", "issued", "scrap"], default: "available", index: true })
  status: string;
}

export const StockBarSchema = SchemaFactory.createForClass(StockBar);
StockBarSchema.index({ materialId: 1, warehouseId: 1, status: 1, remainingLength: -1 });
