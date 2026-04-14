import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User } from './user.schema';

describe('UserService.changePassword', () => {
  let service: UserService;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    validatePassword: jest.fn(),
    password: 'hashed',
    save: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('updates password when current password and policy are valid', async () => {
    mockUser.validatePassword.mockResolvedValue(true);

    const result = await service.changePassword(mockUser as any, {
      currentPassword: 'oldPass1!',
      newPassword: 'NewPass1!',
      confirmPassword: 'NewPass1!',
    });

    expect(result).toEqual({ message: 'Password changed successfully.' });
    expect(mockUser.save).toHaveBeenCalled();
  });

  it('throws 401 when current password is wrong', async () => {
    mockUser.validatePassword.mockResolvedValue(false);

    let error: unknown;
    try {
      await service.changePassword(mockUser as any, {
        currentPassword: 'wrong',
        newPassword: 'NewPass1!',
        confirmPassword: 'NewPass1!',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(HttpException);
    expect((error as HttpException).getStatus()).toBe(401);
  });

  it('throws 422 when new password violates policy', async () => {
    let error: unknown;
    try {
      await service.changePassword(mockUser as any, {
        currentPassword: 'oldPass1!',
        newPassword: 'weak',
        confirmPassword: 'weak',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(HttpException);
    expect((error as HttpException).getStatus()).toBe(422);
  });

  it('throws 400 when new password equals current password', async () => {
    let error: unknown;
    try {
      await service.changePassword(mockUser as any, {
        currentPassword: 'Same1!',
        newPassword: 'Same1!',
        confirmPassword: 'Same1!',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(HttpException);
    expect((error as HttpException).getStatus()).toBe(400);
    expect(mockUser.validatePassword).not.toHaveBeenCalled();
  });
});

describe('UserService.firstLoginChangePassword', () => {
  let service: UserService;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    password: 'hashed',
    isPasswordChangeRequired: true,
    save: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('updates password and clears isPasswordChangeRequired flag on valid new password', async () => {
    const result = await service.firstLoginChangePassword(mockUser as any, {
      newPassword: 'NewPass1!',
    });

    expect(result).toEqual({ message: 'Password changed successfully.' });
    expect(mockUser.isPasswordChangeRequired).toBe(false);
    expect(mockUser.save).toHaveBeenCalled();
  });

  it('throws 400 when new password violates policy', async () => {
    let error: unknown;
    try {
      await service.firstLoginChangePassword(mockUser as any, {
        newPassword: 'weak',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(HttpException);
    expect((error as HttpException).getStatus()).toBe(400);
    expect(mockUser.save).not.toHaveBeenCalled();
  });

  it('throws 400 when new password is missing uppercase', async () => {
    let error: unknown;
    try {
      await service.firstLoginChangePassword(mockUser as any, {
        newPassword: 'newpass1!',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(HttpException);
    expect((error as HttpException).getStatus()).toBe(400);
  });

  it('throws 400 when new password is missing special character', async () => {
    let error: unknown;
    try {
      await service.firstLoginChangePassword(mockUser as any, {
        newPassword: 'NewPass12',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(HttpException);
    expect((error as HttpException).getStatus()).toBe(400);
  });
});
