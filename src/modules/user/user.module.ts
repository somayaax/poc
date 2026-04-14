import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { AdminModule } from '../admin/admin.module';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UserOnlyGuard } from '../auth/guards/user-only.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AdminModule),
  ],
  providers: [UserService, JwtGuard, UserOnlyGuard],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
