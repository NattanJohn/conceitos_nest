import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../infrastructure/entities/category.entity';
import { CreateCategoryDto } from '../presentation/dto/create-category.dto';
import { UpdateCategoryDto } from '../presentation/dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepo: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoriesRepo.find();
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const exists = await this.categoriesRepo.findOneBy({ name: dto.name });
    if (exists) throw new BadRequestException('Category ja existe');
    const cat = this.categoriesRepo.create(dto);
    return this.categoriesRepo.save(cat);
  }

  async findOne(id: string): Promise<Category> {
    const cat = await this.categoriesRepo.findOneBy({ id });
    if (!cat) throw new NotFoundException('Category não encontrada');
    return cat;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const cat = await this.findOne(id);
    Object.assign(cat, dto);
    return this.categoriesRepo.save(cat);
  }

  async remove(id: string): Promise<Category> {
    const cat = await this.findOne(id);
    await this.categoriesRepo.remove(cat);
    return cat;
  }
}
