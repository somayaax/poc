import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AdminModule } from '../admin/admin.module';
import { config } from '../../config/configuration';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    AdminModule,
    JwtModule.register({
      secret: config.get('jwt.secret'),
      signOptions: { expiresIn: config.get('jwt.expiresIn') },
      global: true,
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
