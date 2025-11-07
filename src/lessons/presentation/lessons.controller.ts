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
import { Lesson } from '../infrastructure/entities/lessons.entity';
import { CreateLessonDto } from './dto/create-lasson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonsService } from '../application/lessons.service';
import { JwtAuthGuard } from '../../auth/domain/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/infrastructure/guards/roles.guards';
import { Roles } from '../../auth/infrastructure/decorators/roles.decorator';

@Controller('lessons')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Roles('admin', 'teacher', 'student')
  @Get()
  findAll(): Promise<Lesson[]> {
    return this.lessonsService.findAll();
  }

  @Roles('admin', 'teacher')
  @Post()
  create(@Body() dto: CreateLessonDto): Promise<Lesson> {
    return this.lessonsService.create(dto);
  }

  @Roles('admin', 'teacher', 'student')
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Lesson> {
    return this.lessonsService.findOne(id);
  }

  @Roles('admin', 'teacher')
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateLessonDto): Promise<Lesson> {
    return this.lessonsService.update(id, dto);
  }

  @Roles('admin', 'teacher')
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<Lesson> {
    return this.lessonsService.remove(id);
  }
}
