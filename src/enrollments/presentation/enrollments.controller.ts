import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { EnrollmentsService } from '../application/enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { Enrollment } from '../infrastructure/entities/enrollment.entity';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get()
  findAll(): Promise<Enrollment[]> {
    return this.enrollmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Enrollment> {
    return this.enrollmentsService.findOne(id);
  }

  @Post()
  create(@Body() createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Enrollment> {
    return this.enrollmentsService.remove(id);
  }
}
