import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from '../presentation/dto/create-course.dto';
import { UpdateCourseDto } from '../presentation/dto/update-course.dto';
import { Course } from '../infrasctruture/entities/course.entity';
import { Category } from 'src/categories/infrastructure/entities/category.entity';
import { User } from 'src/users/infrastructure/entities/user.entity';

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
    const instructor = await this.coursesRepository.manager.findOne(User, {
      where: { id: dto.instructorId },
    });
    if (!instructor) {
      throw new NotFoundException('Instrutor não encontrado');
    }

    const category = await this.coursesRepository.manager.findOne(Category, {
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    const newCourse = this.coursesRepository.create({
      ...dto,
      instructor,
      category,
    });

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
