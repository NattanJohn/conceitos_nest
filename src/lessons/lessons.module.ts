import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './infrastructure/entities/lessons.entity';
import { Course } from 'src/courses/infrasctruture/entities/course.entity';
import { LessonsController } from './presentation/lessons.controller';
import { LessonsService } from './application/lessons.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, Course])],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}
