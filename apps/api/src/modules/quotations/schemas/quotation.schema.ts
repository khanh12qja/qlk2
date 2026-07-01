import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { BaseSchema } from "../../../shared/schemas/base.schema";

export type QuotationDocument = HydratedDocument<Quotation>;

@Schema({ _id: false })
export class QuotationBomLine {
  @Prop({ required: true, trim: true })
  lineCode: string;

  @Prop({ type: Types.ObjectId, ref: "Material", required: true })
  materialId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ min: 0 })
  length?: number;

  @Prop({ required: true, min: 0 })
  quantity: number;

  @Prop({ required: true, min: 0, default: 0 })
  wasteRate: number;
}

@Schema({ collection: "quotations", timestamps: true })
export class Quotation extends BaseSchema {
  @Prop({ required: true, trim: true, uppercase: true, unique: true, index: true })
  code: string;

  @Prop({ type: Types.ObjectId, ref: "Customer", index: true })
  customerId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Formula", required: true, index: true })
  formulaId: Types.ObjectId;

  @Prop({ trim: true, uppercase: true })
  variantCode?: string;

  @Prop({ type: Object, required: true })
  parameters: Record<string, string | number | boolean>;

  @Prop({ type: [QuotationBomLine], required: true, default: [] })
  bomLines: QuotationBomLine[];

  @Prop({ required: true, enum: ["draft", "confirmed", "cancelled"], default: "draft", index: true })
  status: string;
}

export const QuotationSchema = SchemaFactory.createForClass(Quotation);
QuotationSchema.index({ createdAt: -1, status: 1 });
