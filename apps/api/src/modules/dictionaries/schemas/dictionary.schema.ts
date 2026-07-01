import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { BaseSchema } from "../../../shared/schemas/base.schema";

export type DictionaryDocument = HydratedDocument<Dictionary>;

@Schema({ _id: false })
export class DictionaryItem {
  @Prop({ required: true, trim: true, uppercase: true })
  code: string;

  @Prop({ required: true, trim: true })
  label: string;

  @Prop({ required: true, default: 0 })
  sortOrder: number;

  @Prop({ required: true, enum: ["active", "inactive"], default: "active" })
  status: string;
}

@Schema({ collection: "dictionaries", timestamps: true })
export class Dictionary extends BaseSchema {
  @Prop({ required: true, trim: true, uppercase: true, unique: true, index: true })
  code: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: [DictionaryItem], default: [] })
  items: DictionaryItem[];
}

export const DictionarySchema = SchemaFactory.createForClass(Dictionary);
