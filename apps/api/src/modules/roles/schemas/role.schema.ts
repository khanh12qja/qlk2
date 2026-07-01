import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { BaseSchema } from "../../../shared/schemas/base.schema";

export type RoleDocument = HydratedDocument<Role>;

@Schema({ collection: "roles", timestamps: true })
export class Role extends BaseSchema {
  @Prop({ required: true, trim: true, uppercase: true, unique: true, index: true })
  code: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: [String], default: [] })
  permissions: string[];

  @Prop({ required: true, enum: ["active", "inactive"], default: "active", index: true })
  status: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
