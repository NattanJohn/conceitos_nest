import { Module } from '@nestjs/common';
import { CoursesController } from './presentation/courses.controller';
import { CoursesService } from './application/courses.service';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
