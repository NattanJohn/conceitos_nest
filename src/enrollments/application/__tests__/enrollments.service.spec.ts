import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EnrollmentsService } from '../enrollments.service';
import { Enrollment } from '../../../enrollments/infrastructure/entities/enrollment.entity';
import { User } from '../../../users/infrastructure/entities/user.entity';
import { Course } from '../../../courses/infrasctruture/entities/course.entity';
import { ObjectLiteral, Repository } from 'typeorm';

type MockRepo<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepo = (): MockRepo => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;
  let enrollmentRepo: MockRepo<Enrollment>;
  let userRepo: MockRepo<User>;
  let courseRepo: MockRepo<Course>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentsService,
        { provide: getRepositoryToken(Enrollment), useValue: createMockRepo() },
        { provide: getRepositoryToken(User), useValue: createMockRepo() },
        { provide: getRepositoryToken(Course), useValue: createMockRepo() },
      ],
    }).compile();

    service = module.get<EnrollmentsService>(EnrollmentsService);
    enrollmentRepo = module.get(getRepositoryToken(Enrollment));
    userRepo = module.get(getRepositoryToken(User));
    courseRepo = module.get(getRepositoryToken(Course));
  });

  // =============== findAll ===================
  describe('findAll', () => {
    it('should return all enrollments', async () => {
      const mockEnrollments = [{ id: '1' }] as Enrollment[];
      enrollmentRepo.find!.mockResolvedValue(mockEnrollments);

      const result = await service.findAll();
      expect(result).toEqual(mockEnrollments);
    });

    it('should throw NotFoundException when no enrollments found', async () => {
      enrollmentRepo.find!.mockResolvedValue([]);

      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  // =============== create ===================
  describe('create', () => {
    const dto = { userId: 'u1', courseId: 'c1' };

    it('should create a new enrollment', async () => {
      const mockUser = { id: 'u1' } as User;
      const mockCourse = { id: 'c1' } as Course;
      const mockEnrollment = { id: 'e1', user: mockUser, course: mockCourse } as Enrollment;

      userRepo.findOne!.mockResolvedValue(mockUser as any);
      courseRepo.findOne!.mockResolvedValue(mockCourse as any);

      enrollmentRepo.create!.mockReturnValue(mockEnrollment);
      enrollmentRepo.save!.mockResolvedValue(mockEnrollment);

      const result = await service.create(dto);
      expect(result).toEqual(mockEnrollment);
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepo.findOne!.mockResolvedValue(null as any);

      await expect(service.create(dto)).rejects.toThrow('Usuário não encontrado');
    });

    it('should throw NotFoundException if course not found', async () => {
      userRepo.findOne!.mockResolvedValue({ id: 'u1' } as User);
      courseRepo.findOne!.mockResolvedValue(null as any);

      await expect(service.create(dto)).rejects.toThrow('Curso não encontrado');
    });
  });

  // =============== findOne ===================
  describe('findOne', () => {
    it('should return one enrollment', async () => {
      const mockEnrollment = { id: 'e1' } as Enrollment;
      enrollmentRepo.findOne!.mockResolvedValue(mockEnrollment);

      const result = await service.findOne('e1');
      expect(result).toEqual(mockEnrollment);
    });

    it('should throw NotFoundException when enrollment not found', async () => {
      enrollmentRepo.findOne!.mockResolvedValue(null as any);

      await expect(service.findOne('e1')).rejects.toThrow(NotFoundException);
    });
  });

  // =============== remove ===================
  describe('remove', () => {
    it('should remove enrollment', async () => {
      const mockEnrollment = { id: 'e1' } as Enrollment;

      jest.spyOn(service, 'findOne').mockResolvedValue(mockEnrollment);
      enrollmentRepo.remove!.mockResolvedValue(mockEnrollment);

      const result = await service.remove('e1');
      expect(result).toEqual(mockEnrollment);
    });

    it('should throw NotFoundException when remove fails because enrollment does not exist', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.remove('e1')).rejects.toThrow(NotFoundException);
    });
  });
});
