import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { CoursesService } from '../application/courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from '../infrasctruture/entities/course.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll(): Promise<Course[]> {
    return this.coursesService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.coursesService.create(createCourseDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Course> {
    return this.coursesService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto): Promise<Course> {
    return this.coursesService.update(id, updateCourseDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Course> {
    return this.coursesService.remove(id);
  }
}
