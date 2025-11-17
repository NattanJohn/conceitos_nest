/* eslint-disable @typescript-eslint/unbound-method */

import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PasswordReset } from '../../domain/entities/password-reset.entity';
import { User } from '../../../users/infrastructure/entities/user.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { MailService } from '../../../mail/application/mail.service';
import * as bcrypt from 'bcrypt';
import { PasswordResetService } from '../reset-password.service';

type MockRepo<T extends object = any> = {
  [P in keyof Repository<T>]: jest.Mock;
};

const createMockRepo = () =>
  ({
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  }) as unknown as MockRepo;

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('PasswordResetService', () => {
  let service: PasswordResetService;
  let resetRepo: MockRepo<PasswordReset>;
  let userRepo: MockRepo<User>;
  let mailService: MailService;

  const mockMailService = {
    sendPasswordResetMail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordResetService,
        { provide: getRepositoryToken(PasswordReset), useValue: createMockRepo() },
        { provide: getRepositoryToken(User), useValue: createMockRepo() },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get(PasswordResetService);
    resetRepo = module.get(getRepositoryToken(PasswordReset));
    userRepo = module.get(getRepositoryToken(User));
    mailService = module.get(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ---------------------------------------------------------
  // sendResetCode
  // ---------------------------------------------------------
  it('should send reset code when user exists', async () => {
    const user = { id: '1', email: 'test@email.com', name: 'Nattan' } as User;

    userRepo.findOne.mockResolvedValue(user);
    resetRepo.create.mockReturnValue({ code: '123456', user_id: '1' });
    resetRepo.save.mockResolvedValue(undefined);

    const result = await service.sendResetCode(user.email);

    expect(userRepo.findOne).toHaveBeenCalledWith({ where: { email: user.email } });
    expect(resetRepo.delete).toHaveBeenCalledWith({ user_id: user.id });
    expect(resetRepo.create).toHaveBeenCalled();
    expect(resetRepo.save).toHaveBeenCalled();
    expect(mailService.sendPasswordResetMail).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Código enviado para o e-mail.' });
  });

  it('should throw if user does not exist (sendResetCode)', async () => {
    userRepo.findOne.mockResolvedValue(null);

    await expect(service.sendResetCode('x@email.com')).rejects.toBeInstanceOf(NotFoundException);
  });

  // ---------------------------------------------------------
  // resetPassword
  // ---------------------------------------------------------
  it('should reset password when data is correct', async () => {
    const user = { id: '1', email: 'a@a.com', password: '' } as User;

    const reset = {
      id: '10',
      user_id: '1',
      code: '123456',
      expiresAt: new Date(Date.now() + 10000),
    } as PasswordReset;

    userRepo.findOne.mockResolvedValue(user);
    resetRepo.findOne.mockResolvedValue(reset);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    userRepo.save.mockResolvedValue(undefined);
    resetRepo.delete.mockResolvedValue(undefined);

    const result = await service.resetPassword('a@a.com', '123456', 'newpass');

    expect(userRepo.save).toHaveBeenCalled();
    expect(resetRepo.delete).toHaveBeenCalledWith({ id: reset.id });
    expect(result).toEqual({ message: 'Senha atualizada com sucesso.' });
  });

  it('should throw if user does not exist (resetPassword)', async () => {
    userRepo.findOne.mockResolvedValue(null);

    await expect(service.resetPassword('x@x.com', '123', 'newpass')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should throw if code is invalid', async () => {
    userRepo.findOne.mockResolvedValue({ id: '1' });
    resetRepo.findOne.mockResolvedValue(null);

    await expect(service.resetPassword('x@x.com', '123', 'newpass')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('should throw if code is expired', async () => {
    userRepo.findOne.mockResolvedValue({ id: '1' });

    resetRepo.findOne.mockResolvedValue({
      expiresAt: new Date(Date.now() - 10000), // expirado
    });

    await expect(service.resetPassword('x@x.com', '123', 'newpass')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
