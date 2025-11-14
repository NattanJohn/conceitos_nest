import { Course } from '../../../courses/infrasctruture/entities/course.entity';
import { User } from '../../../users/infrastructure/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  RelationId,
} from 'typeorm';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.enrollments, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @RelationId((enrollment: Enrollment) => enrollment.user)
  userId: string;

  @ManyToOne(() => Course, (course) => course.enrollments, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @RelationId((enrollment: Enrollment) => enrollment.course)
  courseId: string;

  @CreateDateColumn()
  enrolledAt: Date;
}
