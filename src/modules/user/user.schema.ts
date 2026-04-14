import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true, maxlength: 100 })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, maxlength: 30 })
  firstName: string;

  @Prop({ required: true, maxlength: 30 })
  lastName: string;

  @Prop({ required: true })
  dob: Date;

  @Prop({ default: false })
  isPasswordChangeRequired: boolean;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = this.toObject();
    return rest;
  }
}
export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<User>('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
UserSchema.loadClass(User);
