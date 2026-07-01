import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { BaseSchema } from "../../../shared/schemas/base.schema";

export type WarehouseDocument = HydratedDocument<Warehouse>;

@Schema({ collection: "warehouses", timestamps: true })
export class Warehouse extends BaseSchema {
  @Prop({ required: true, trim: true, uppercase: true, unique: true, index: true })
  code: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  address?: string;

  @Prop({ required: true, enum: ["active", "inactive"], default: "active", index: true })
  status: string;
}

export const WarehouseSchema = SchemaFactory.createForClass(Warehouse);
