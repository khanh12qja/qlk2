import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { BaseSchema } from "../../../shared/schemas/base.schema";

export type StockMovementDocument = HydratedDocument<StockMovement>;

@Schema({ collection: "stock_movements", timestamps: true })
export class StockMovement extends BaseSchema {
  @Prop({ type: Types.ObjectId, ref: "Material", required: true, index: true })
  materialId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Warehouse", required: true, index: true })
  warehouseId: Types.ObjectId;

  @Prop({ required: true, enum: ["in", "out", "adjustment", "reservation", "release"], index: true })
  type: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ min: 0 })
  length?: number;

  @Prop({ trim: true })
  referenceType?: string;

  @Prop({ type: Types.ObjectId })
  referenceId?: Types.ObjectId;

  @Prop({ trim: true })
  note?: string;
}

export const StockMovementSchema = SchemaFactory.createForClass(StockMovement);
StockMovementSchema.index({ materialId: 1, warehouseId: 1, createdAt: -1 });
