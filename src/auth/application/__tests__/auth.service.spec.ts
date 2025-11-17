/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../../../users/infrastructure/entities/user.entity';
import { UsersService } from '../../../users/application/users.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser: User = {
    id: '1',
    name: 'Test',
    email: 'test@test.com',
    password: 'hashed_pass',
    refreshToken: 'hashed_refresh',
    role: 'user',
    isActive: true,
  } as User;

  beforeEach(async () => {
    const mockUsersService = {
      findByEmail: jest.fn(),
      findOne: jest.fn(),
      updateRefreshToken: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);

    jest.clearAllMocks();
  });

  // ----------------------------------------------------------- validateUser
  it('should validate and return user', async () => {
    usersService.findByEmail.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await service.validateUser('test@test.com', '123');

    expect(result).toEqual(mockUser);
    expect(usersService.findByEmail).toHaveBeenCalledWith('test@test.com');
  });

  it('should throw if user not found', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(service.validateUser('x', '123')).rejects.toThrow(UnauthorizedException);
  });

  it('should throw if password incorrect', async () => {
    usersService.findByEmail.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.validateUser('x', '123')).rejects.toThrow(UnauthorizedException);
  });

  // --------------------------------------------------------------- login
  it('should login and return tokens', async () => {
    jwtService.sign.mockReturnValueOnce('access_token').mockReturnValueOnce('refresh_token');

    usersService.updateRefreshToken.mockResolvedValue(undefined);

    const result = await service.login(mockUser);

    expect(result.access_token).toBe('access_token');
    expect(result.refresh_token).toBe('refresh_token');
    expect(usersService.updateRefreshToken).toHaveBeenCalledWith('1', 'refresh_token');
  });

  it('should throw if user inactive on login', async () => {
    const inactive = { ...mockUser, isActive: false };

    await expect(service.login(inactive)).rejects.toThrow(UnauthorizedException);
  });

  // ----------------------------------------------------- refreshTokens
  it('should refresh tokens successfully', async () => {
    jwtService.verify.mockReturnValue({
      sub: mockUser.id,
      email: mockUser.email,
      role: mockUser.role,
    });

    usersService.findOne.mockResolvedValue(mockUser);

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    jwtService.sign.mockReturnValueOnce('new_access').mockReturnValueOnce('new_refresh');

    const result = await service.refreshTokens('valid_token');

    expect(result.access_token).toBe('new_access');
    expect(result.refresh_token).toBe('new_refresh');
    expect(usersService.updateRefreshToken).toHaveBeenCalledWith('1', 'new_refresh');
  });

  it('should throw if jwt.verify fails', async () => {
    jwtService.verify.mockImplementation(() => {
      throw new Error();
    });

    await expect(service.refreshTokens('invalid')).rejects.toThrow(UnauthorizedException);
  });

  it('should throw if user not found on refresh', async () => {
    jwtService.verify.mockReturnValue({ sub: '1' });

    (usersService.findOne as jest.Mock).mockResolvedValue(null);

    await expect(service.refreshTokens('x')).rejects.toThrow(UnauthorizedException);
  });

  it('should throw if user inactive on refresh', async () => {
    jwtService.verify.mockReturnValue({ sub: '1' });

    usersService.findOne.mockResolvedValue({ ...mockUser, isActive: false });

    await expect(service.refreshTokens('x')).rejects.toThrow(UnauthorizedException);
  });

  it('should throw if refreshToken hash does not match', async () => {
    jwtService.verify.mockReturnValue({ sub: '1' });
    usersService.findOne.mockResolvedValue(mockUser);

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.refreshTokens('x')).rejects.toThrow(UnauthorizedException);
  });
});
