import { Module } from '@nestjs/common';
import { CoursesController } from './presentation/courses.controller';
import { CoursesService } from './application/courses.service';
import { Course } from './infrasctruture/entities/course.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
