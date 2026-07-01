import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type AuditLogDocument = HydratedDocument<AuditLog>;

@Schema({ collection: "audit_logs", timestamps: { createdAt: true, updatedAt: false } })
export class AuditLog {
  @Prop({ type: Types.ObjectId, ref: "User", index: true })
  actorId?: Types.ObjectId;

  @Prop({ required: true, trim: true, index: true })
  module: string;

  @Prop({ required: true, trim: true, index: true })
  action: string;

  @Prop({ required: true, trim: true })
  entityType: string;

  @Prop({ type: Types.ObjectId, index: true })
  entityId?: Types.ObjectId;

  @Prop({ type: Object })
  before?: unknown;

  @Prop({ type: Object })
  after?: unknown;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
AuditLogSchema.index({ module: 1, action: 1, createdAt: -1 });
