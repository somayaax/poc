import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.dto';
import { SuccessResponse } from '../../common/types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async loginUser(@Body() loginInput: LoginInput): Promise<SuccessResponse> {
    return this.authService.loginUser(loginInput);
  }

  @Post('admin/login')
  async loginAdmin(@Body() loginInput: LoginInput): Promise<SuccessResponse> {
    return this.authService.loginAdmin(loginInput);
  }
}
