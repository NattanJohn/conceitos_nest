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
import { AuthGuard } from '@nestjs/passport';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  findAll(): Promise<Lesson[]> {
    return this.lessonsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateLessonDto): Promise<Lesson> {
    return this.lessonsService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Lesson> {
    return this.lessonsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateLessonDto): Promise<Lesson> {
    return this.lessonsService.update(id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<Lesson> {
    return this.lessonsService.remove(id);
  }
}
