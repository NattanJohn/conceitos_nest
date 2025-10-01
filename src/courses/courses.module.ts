import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './presentation/courses.controller';
import { CoursesService } from './application/courses.service';
import { User } from '../users/infrastructure/entities/user.entity';
import { Category } from '../categories/infrastructure/entities/category.entity';
import { Course } from './infrasctruture/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, User, Category])],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
