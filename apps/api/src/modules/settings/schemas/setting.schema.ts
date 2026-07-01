import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { BaseSchema } from "../../../shared/schemas/base.schema";

export type SettingDocument = HydratedDocument<Setting>;

@Schema({ collection: "settings", timestamps: true })
export class Setting extends BaseSchema {
  @Prop({ required: true, trim: true, unique: true, index: true })
  key: string;

  @Prop({ type: Object, required: true })
  value: unknown;

  @Prop({ trim: true })
  description?: string;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
