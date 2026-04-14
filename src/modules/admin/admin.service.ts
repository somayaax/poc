import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './admin.schema';
import { Model } from 'mongoose';
import { config } from '../../config/configuration';
import { AdminStatus } from '../../common/types';
import { CreateAdminInput } from './dto/create.dto';
import { ApiException } from '../../common/api.exception';
import { buildSuccessResponse } from '../../common/utils';
import { ChangePasswordInput } from './dto/change-password.dto';

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(@InjectModel(Admin.name) private adminModel: Model<Admin>) {}
  private readonly logger = new Logger(AdminService.name);

  async onModuleInit() {
    const { allowSeeding, email, password } = config.get('superAdmin');
    if (!allowSeeding)
      return this.logger.log('Seeding super admin is disabled!');
    this.logger.log('Start seeding super admin...');

    const admin = await this.adminModel.findOne({ email });
    if (admin) return this.logger.log('Super Admin found in database!');
    const superAdmin = {
      email,
      password,
      isSuperAdmin: true,
      roles: [],
      status: AdminStatus.ACTIVE,
      mustChangePassword: false,
    };

    await this.adminModel.create(superAdmin);
    return this.logger.log('Super Admin seeded successfully!');
  }
  async findById(id: string) {
    return await this.adminModel.findById(id);
  }

  async findOne(filter: any) {
    return await this.adminModel.findOne(filter);
  }

  async create(adminInput: CreateAdminInput) {
    const { email } = adminInput;
    const emailExists = await this.findOne({ email });

    if (emailExists)
      throw new ApiException('Email already exists', 'EMAIL_EXISTS');

    const admin = await this.adminModel.create(adminInput);

    return buildSuccessResponse({
      message: 'Admin created successfully',
      data: admin,
    });
  }

  async changePassword(admin: Admin, input: ChangePasswordInput) {
    const { currentPassword, newPassword } = input;

    if (currentPassword === newPassword)
      throw new ApiException('New password cannot be same as old password');

    const valid = await admin.validatePassword(currentPassword);
    if (!valid) throw ApiException.invalidCredentials();

    admin.password = newPassword;
    admin.mustChangePassword = false;
    await admin.save();

    return buildSuccessResponse({
      message: 'Password changed successfully',
    });
  }
}
