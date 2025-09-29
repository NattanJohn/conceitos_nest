import { Injectable, NotFoundException } from '@nestjs/common';
import { Course } from '../domain/course.entity';
import { CreateCourseDto } from '../presentation/dto/create-course.dto';
import { UpdateCourseDto } from '../presentation/dto/update-course.dto';

@Injectable()
export class CoursesService {
  private courses: Course[] = [];

  findAll(): Course[] {
    if (this.courses.length === 0) {
      throw new NotFoundException('Nenhum curso encontrado');
    }
    return this.courses;
  }

  create(dto: CreateCourseDto): Course {
    const newCourse: Course = {
      id: Date.now(),
      ...dto,
    };
    this.courses.push(newCourse);
    return newCourse;
  }

  findOne(id: number): Course {
    const course = this.courses.find((c) => c.id === id);
    if (!course) {
      throw new NotFoundException(`Curso não encontrado`);
    }
    return course;
  }

  update(id: number, dto: UpdateCourseDto): Course {
    const course = this.findOne(id);
    Object.assign(course, dto);
    return course;
  }

  remove(id: number): Course {
    const index = this.courses.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Curso não encontrado`);
    }
    const deletedCourse = this.courses[index];
    this.courses.splice(index, 1);
    return deletedCourse;
  }
}
