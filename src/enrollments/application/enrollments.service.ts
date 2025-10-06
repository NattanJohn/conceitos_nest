import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEnrollmentDto } from '../presentation/dto/create-enrollment.dto';
import { User } from '../../users/infrastructure/entities/user.entity';
import { Course } from '../../courses/infrasctruture/entities/course.entity';
import { Enrollment } from '../infrastructure/entities/enrollment.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async findAll(): Promise<Enrollment[]> {
    const enrollments = await this.enrollmentRepository.find();
    if (!enrollments.length) {
      throw new NotFoundException('Nenhuma matrícula encontrada');
    }
    return enrollments;
  }

  async create(dto: CreateEnrollmentDto): Promise<Enrollment> {
    const user = await this.userRepository.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const course = await this.courseRepository.findOne({ where: { id: dto.courseId } });
    if (!course) throw new NotFoundException('Curso não encontrado');

    const newEnrollment = this.enrollmentRepository.create({
      user,
      course,
    });

    return await this.enrollmentRepository.save(newEnrollment);
  }

  async findOne(id: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findOne({ where: { id } });
    if (!enrollment) throw new NotFoundException('Matrícula não encontrada');
    return enrollment;
  }

  async remove(id: string): Promise<Enrollment> {
    const enrollment = await this.findOne(id);
    await this.enrollmentRepository.remove(enrollment);
    return enrollment;
  }
}
