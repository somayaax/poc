import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'password_changes',
  timestamps: false,
})
export class PasswordChange {
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true, default: Date.now })
  changed_at: Date;

  @Prop({ required: true })
  ip_address: string;

  @Prop({ required: true })
  user_agent: string;
}

export type PasswordChangeDocument = HydratedDocument<PasswordChange>;
export const PasswordChangeSchema =
  SchemaFactory.createForClass(PasswordChange);
