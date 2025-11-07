import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { EnrollmentsService } from '../application/enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { Enrollment } from '../infrastructure/entities/enrollment.entity';
import { JwtAuthGuard } from '../../auth/domain/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/infrastructure/guards/roles.guards';
import { Roles } from '../../auth/infrastructure/decorators/roles.decorator';

@Controller('enrollments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Roles('admin', 'teacher')
  @Get()
  findAll(): Promise<Enrollment[]> {
    return this.enrollmentsService.findAll();
  }

  @Roles('admin', 'teacher', 'student')
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Enrollment> {
    return this.enrollmentsService.findOne(id);
  }

  @Roles('admin', 'teacher')
  @Post()
  create(@Body() createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Enrollment> {
    return this.enrollmentsService.remove(id);
  }
}
