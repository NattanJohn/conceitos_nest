import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from '../presentation/dto/create-course.dto';
import { UpdateCourseDto } from '../presentation/dto/update-course.dto';
import { Course } from '../infrasctruture/entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
  ) {}

  async findAll(): Promise<Course[]> {
    const courses = await this.coursesRepository.find();
    if (!courses.length) {
      throw new NotFoundException('Nenhum curso encontrado');
    }
    return courses;
  }

  async create(dto: CreateCourseDto): Promise<Course> {
    const newCourse = this.coursesRepository.create(dto);
    return await this.coursesRepository.save(newCourse);
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.coursesRepository.findOneBy({ id });
    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }
    return course;
  }

  async update(id: string, dto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);
    Object.assign(course, dto);
    return this.coursesRepository.save(course);
  }

  async remove(id: string): Promise<Course> {
    const course = await this.findOne(id);
    await this.coursesRepository.remove(course);
    return course;
  }
}
