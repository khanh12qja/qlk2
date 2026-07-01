import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { BaseSchema } from "../../../shared/schemas/base.schema";

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: "users", timestamps: true })
export class User extends BaseSchema {
  @Prop({ required: true, trim: true, lowercase: true, unique: true, index: true })
  email: string;

  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, select: false })
  passwordHash: string;

  @Prop({ type: [Types.ObjectId], ref: "Role", default: [] })
  roleIds: Types.ObjectId[];

  @Prop({ required: true, enum: ["active", "inactive"], default: "active", index: true })
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
