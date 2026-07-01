import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { BaseSchema } from "../../../shared/schemas/base.schema";

export type MaterialDocument = HydratedDocument<Material>;

@Schema({ collection: "materials", timestamps: true })
export class Material extends BaseSchema {
  @Prop({ required: true, trim: true, uppercase: true, unique: true, index: true })
  code: string;

  @Prop({ required: true, trim: true, uppercase: true, index: true })
  baseCode: string;

  @Prop({ required: true, trim: true, index: "text" })
  name: string;

  @Prop({ required: true, trim: true, index: true })
  category: string;

  @Prop({ trim: true, uppercase: true, index: true })
  colorCode?: string;

  @Prop({ trim: true })
  colorName?: string;

  @Prop({ required: true, trim: true })
  unit: string;

  @Prop({ required: true, default: false, index: true })
  manageLength: boolean;

  @Prop({ min: 0 })
  standardLength?: number;

  @Prop({ required: true, enum: ["active", "inactive"], default: "active", index: true })
  status: string;
}

export const MaterialSchema = SchemaFactory.createForClass(Material);

MaterialSchema.index({ category: 1, colorCode: 1, status: 1 });
