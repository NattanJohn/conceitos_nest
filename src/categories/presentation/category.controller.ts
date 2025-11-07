import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from '../infrastructure/entities/category.entity';
import { CategoriesService } from '../application/category.service';
import { JwtAuthGuard } from '../../auth/domain/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/infrastructure/guards/roles.guards';
import { Roles } from '../../auth/infrastructure/decorators/roles.decorator';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Roles('admin', 'teacher', 'student')
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Post()
  @Roles('admin', 'teacher')
  create(@Body() dto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(dto);
  }

  @Get(':id')
  @Roles('admin', 'teacher', 'student')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'teacher')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<Category> {
    return this.categoriesService.remove(id);
  }
}
