import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { BaseSchema } from "../../../shared/schemas/base.schema";

export type FormulaDocument = HydratedDocument<Formula>;

@Schema({ _id: false })
export class FormulaParameterOption {
  @Prop({ required: true, trim: true, uppercase: true })
  code: string;

  @Prop({ required: true, trim: true })
  label: string;
}

@Schema({ _id: false })
export class FormulaParameter {
  @Prop({ required: true, trim: true, uppercase: true })
  code: string;

  @Prop({ required: true, trim: true })
  label: string;

  @Prop({ required: true, enum: ["number", "text", "select", "boolean"] })
  type: string;

  @Prop({ required: true, default: true })
  required: boolean;

  @Prop({ trim: true })
  optionsDictionaryCode?: string;

  @Prop({ type: [FormulaParameterOption], default: [] })
  options?: FormulaParameterOption[];

  @Prop({ type: Object })
  defaultValue?: string | number | boolean;
}

@Schema({ _id: false })
export class FormulaVariant {
  @Prop({ required: true, trim: true, uppercase: true })
  code: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  nameTemplate?: string;

  @Prop({ type: Object, required: true, default: {} })
  parameters: Record<string, string | number | boolean>;

  @Prop({ required: true, enum: ["active", "inactive"], default: "active" })
  status: string;
}

@Schema({ _id: false })
export class FormulaItem {
  @Prop({ required: true, trim: true, uppercase: true })
  lineCode: string;

  @Prop({ type: Types.ObjectId, ref: "Material", required: true, index: true })
  materialId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ trim: true })
  lengthExpression?: string;

  @Prop({ required: true, trim: true })
  quantityExpression: string;

  @Prop({ trim: true })
  conditionExpression?: string;

  @Prop({ required: true, min: 0, default: 0 })
  wasteRate: number;
}

@Schema({ collection: "formulas", timestamps: true })
export class Formula extends BaseSchema {
  @Prop({ required: true, trim: true, uppercase: true, unique: true, index: true })
  code: string;

  @Prop({ required: true, trim: true, index: "text" })
  name: string;

  @Prop({ type: [FormulaParameter], required: true, default: [] })
  parameters: FormulaParameter[];

  @Prop({ type: [FormulaVariant], required: true, default: [] })
  variants: FormulaVariant[];

  @Prop({ type: [FormulaItem], required: true, default: [] })
  items: FormulaItem[];

  @Prop({ required: true, enum: ["active", "inactive"], default: "active", index: true })
  status: string;
}

export const FormulaSchema = SchemaFactory.createForClass(Formula);

FormulaSchema.index({ code: 1, status: 1 });
