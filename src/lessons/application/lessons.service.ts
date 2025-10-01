import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from '../infrastructure/entities/lessons.entity';
import { CreateLessonDto } from '../presentation/dto/create-lasson.dto';
import { Course } from 'src/courses/infrasctruture/entities/course.entity';
import { UpdateLessonDto } from '../presentation/dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonsRepo: Repository<Lesson>,

    @InjectRepository(Course)
    private readonly coursesRepo: Repository<Course>,
  ) {}

  async findAll(): Promise<Lesson[]> {
    return this.lessonsRepo.find();
  }

  async create(dto: CreateLessonDto): Promise<Lesson> {
    // validar se course existe
    const course = await this.coursesRepo.findOneBy({ id: dto.courseId });
    if (!course) throw new NotFoundException('Curso nao encontrado');

    const lesson = this.lessonsRepo.create({
      title: dto.title,
      content: dto.content,
      videoUrl: dto.videoUrl,
      course,
    });
    return this.lessonsRepo.save(lesson);
  }

  async findOne(id: string): Promise<Lesson> {
    const lesson = await this.lessonsRepo.findOneBy({ id });
    if (!lesson) throw new NotFoundException('Matéria nao encontrada');
    return lesson;
  }

  async update(id: string, dto: UpdateLessonDto): Promise<Lesson> {
    const lesson = await this.findOne(id);
    if (dto.courseId) {
      const course = await this.coursesRepo.findOneBy({ id: dto.courseId });
      if (!course) throw new NotFoundException('Matéria nao encontrada');
      lesson.course = course;
    }
    Object.assign(lesson, dto);
    return this.lessonsRepo.save(lesson);
  }

  async remove(id: string): Promise<Lesson> {
    const lesson = await this.findOne(id);
    await this.lessonsRepo.remove(lesson);
    return lesson;
  }
}
