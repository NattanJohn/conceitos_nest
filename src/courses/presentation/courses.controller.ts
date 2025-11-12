import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CoursesService } from '../application/courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from '../infrasctruture/entities/course.entity';
import { JwtAuthGuard } from '../../auth/domain/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/infrastructure/guards/roles.guards';
import { Roles } from '../../auth/infrastructure/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { courseMulterOptions } from '../infrasctruture/storage/multer.config';

@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @Roles('admin', 'teacher', 'student')
  findAll(): Promise<Course[]> {
    return this.coursesService.findAll();
  }

  @Post()
  @Roles('admin', 'teacher')
  create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.coursesService.create(createCourseDto);
  }

  @Get(':id')
  @Roles('admin', 'teacher', 'student')
  findOne(@Param('id') id: string): Promise<Course> {
    return this.coursesService.findOne(id);
  }

  @Put(':id')
  @Roles('admin', 'teacher')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto): Promise<Course> {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string): Promise<Course> {
    return this.coursesService.remove(id);
  }

  @Put(':id/thumbnail')
  @Roles('admin', 'teacher')
  @UseInterceptors(FileInterceptor('thumbnail', courseMulterOptions()))
  uploadThumbnail(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Course> {
    if (!file) {
      throw new NotFoundException('Arquivo não enviado');
    }

    return this.coursesService.updateThumbnail(id, file.filename);
  }
}
