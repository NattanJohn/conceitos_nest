import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentsService } from './application/enrollments.service';
import { EnrollmentsController } from './presentation/enrollments.controller';
import { User } from '../users/infrastructure/entities/user.entity';
import { Course } from '../courses/infrasctruture/entities/course.entity';
import { Enrollment } from './infrastructure/entities/enrollment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, User, Course])],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
})
export class EnrollmentsModule {}
