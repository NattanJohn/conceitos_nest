/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { Repository } from 'typeorm';
import { User } from '../../infrastructure/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: jest.Mocked<Repository<User>>;

  jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashed_pass'),
  }));

  const mockUser: User = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashed_pass',
    isActive: true,
  } as User;

  const mockUsersRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  } as unknown as jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ------------------ findAll ------------------
  it('should return users list', async () => {
    usersRepository.find.mockResolvedValue([mockUser]);

    const result = await service.findAll();
    expect(result).toEqual([mockUser]);
    expect(usersRepository.find).toHaveBeenCalled();
  });

  it('should throw NotFoundException when no users found', async () => {
    usersRepository.find.mockResolvedValue([]);

    await expect(service.findAll()).rejects.toThrow(NotFoundException);
  });

  // ------------------ create ------------------
  it('should create a new user', async () => {
    const dto = { name: 'Test', email: 'test@example.com', password: '123456', role: 'user' };

    usersRepository.findOneBy.mockResolvedValue(null);
    usersRepository.create.mockReturnValue(mockUser);
    usersRepository.save.mockResolvedValue(mockUser);

    const result = await service.create(dto);

    expect(result).toEqual(mockUser);
    expect(usersRepository.save).toHaveBeenCalled();
  });

  it('should throw ConflictException when email exists', async () => {
    usersRepository.findOneBy.mockResolvedValue(mockUser);

    await expect(
      service.create({ name: 'x', email: 'test@example.com', password: '123', role: 'admin' }),
    ).rejects.toThrow(ConflictException);
  });

  // ------------------ findOne ------------------
  it('should return one user', async () => {
    usersRepository.findOneBy.mockResolvedValue(mockUser);

    const result = await service.findOne('1');
    expect(result).toEqual(mockUser);
  });

  it('should throw NotFoundException on findOne', async () => {
    usersRepository.findOneBy.mockResolvedValue(null);

    await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
  });

  // ------------------ update ------------------
  it('should update user', async () => {
    const dto = { name: 'Updated' };

    usersRepository.findOneBy.mockResolvedValue(mockUser);
    usersRepository.save.mockResolvedValue({ ...mockUser, ...dto });

    const result = await service.update('1', dto);

    expect(result.name).toBe('Updated');
    expect(usersRepository.save).toHaveBeenCalled();
  });

  // ------------------ remove ------------------
  it('should remove user', async () => {
    usersRepository.findOneBy.mockResolvedValue(mockUser);
    usersRepository.remove.mockResolvedValue(mockUser);

    const result = await service.remove('1');

    expect(result).toEqual(mockUser);
    expect(usersRepository.remove).toHaveBeenCalled();
  });
});
