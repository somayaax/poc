import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AdminRole, AdminStatus } from '../../common/types';

@Schema({ timestamps: true })
export class Admin extends Document {
  @Prop({ required: true, unique: true, maxlength: 100 })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: AdminRole, type: [String] })
  roles: AdminRole[];

  @Prop()
  lastLogin?: Date;

  @Prop({ required: true, enum: AdminStatus })
  status: AdminStatus;

  @Prop({ default: false })
  isSuperAdmin: boolean;

  @Prop({ default: true })
  mustChangePassword: boolean;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = this.toObject();
    return rest;
  }
}

export type AdminDocument = HydratedDocument<Admin>;

export const AdminSchema = SchemaFactory.createForClass(Admin);

AdminSchema.pre<Admin>('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
AdminSchema.loadClass(Admin);
