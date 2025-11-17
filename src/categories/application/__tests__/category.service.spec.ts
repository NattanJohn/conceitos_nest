/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Category } from '../../infrastructure/entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CategoriesService } from '../category.service';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoriesRepo: jest.Mocked<Repository<Category>>;

  const mockCategory: Category = {
    id: '1',
    name: 'Backend',
    courses: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Category;

  const mockCategoriesRepo = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  } as unknown as jest.Mocked<Repository<Category>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoriesRepo,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoriesRepo = module.get(getRepositoryToken(Category));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ---------------------------------------------------------------- findAll
  it('should return categories list', async () => {
    categoriesRepo.find.mockResolvedValue([mockCategory]);

    const result = await service.findAll();

    expect(result).toEqual([mockCategory]);
    expect(categoriesRepo.find).toHaveBeenCalled();
  });

  // ---------------------------------------------------------------- create
  it('should create a category', async () => {
    const dto = { name: 'Backend' };

    categoriesRepo.findOneBy.mockResolvedValue(null);
    categoriesRepo.create.mockReturnValue(mockCategory);
    categoriesRepo.save.mockResolvedValue(mockCategory);

    const result = await service.create(dto);

    expect(result).toEqual(mockCategory);
    expect(categoriesRepo.save).toHaveBeenCalled();
  });

  it('should throw BadRequestException if category already exists', async () => {
    categoriesRepo.findOneBy.mockResolvedValue(mockCategory);

    await expect(service.create({ name: 'Backend' })).rejects.toThrow(BadRequestException);
  });

  // ---------------------------------------------------------------- findOne
  it('should return a category', async () => {
    categoriesRepo.findOneBy.mockResolvedValue(mockCategory);

    const result = await service.findOne('1');

    expect(result).toEqual(mockCategory);
  });

  it('should throw NotFoundException when category not found', async () => {
    categoriesRepo.findOneBy.mockResolvedValue(null);

    await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
  });

  // ---------------------------------------------------------------- update
  it('should update a category', async () => {
    const dto = { name: 'Updated' };

    categoriesRepo.findOneBy.mockResolvedValue(mockCategory);
    categoriesRepo.save.mockResolvedValue({ ...mockCategory, ...dto });

    const result = await service.update('1', dto);

    expect(result.name).toBe('Updated');
    expect(categoriesRepo.save).toHaveBeenCalled();
  });

  // ---------------------------------------------------------------- remove
  it('should remove a category', async () => {
    categoriesRepo.findOneBy.mockResolvedValue(mockCategory);
    categoriesRepo.remove.mockResolvedValue(mockCategory);

    const result = await service.remove('1');

    expect(result).toEqual(mockCategory);
    expect(categoriesRepo.remove).toHaveBeenCalled();
  });
});
