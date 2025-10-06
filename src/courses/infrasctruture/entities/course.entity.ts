import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { User } from '../../../users/infrastructure/entities/user.entity';
import { Category } from '../../../categories/infrastructure/entities/category.entity';
import { Lesson } from 'src/lessons/infrastructure/entities/lessons.entity';
import { Enrollment } from 'src/enrollments/infrastructure/entities/enrollment.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  thumbnail: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'instructorId' })
  instructor: User;

  @RelationId((course: Course) => course.instructor)
  instructorId: string;

  @ManyToOne(() => Category, (c) => c.courses, { eager: true, nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @RelationId((course: Course) => course.category)
  categoryId: string;

  @OneToMany(() => Lesson, (l) => l.course)
  lessons: Lesson[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
