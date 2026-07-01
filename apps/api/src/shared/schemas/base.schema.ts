import { Prop } from "@nestjs/mongoose";
import { Types } from "mongoose";

export class BaseSchema {
  @Prop({ type: Types.ObjectId })
  createdBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  updatedBy?: Types.ObjectId;
}
