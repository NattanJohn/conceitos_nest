import { Test, TestingModule } from '@nestjs/testing';
import { Lesson } from '../../infrastructure/entities/lessons.entity';
import { Course } from '../../../courses/infrasctruture/entities/course.entity';
import { Repository, ObjectLiteral } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { LessonsService } from '../lessons.service';

// ----------------------------------------
// Correct mock typing
// ----------------------------------------
type MockRepo<T extends ObjectLiteral = any> = {
  [P in keyof Repository<T>]: jest.Mock;
};

// Creates a mock with all repository methods defined (no optional methods)
const createMockRepo = (): MockRepo =>
  ({
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  }) as unknown as MockRepo;

describe('LessonsService', () => {
  let service: LessonsService;
  let lessonsRepo: MockRepo<Lesson>;
  let coursesRepo: MockRepo<Course>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonsService,
        { provide: getRepositoryToken(Lesson), useValue: createMockRepo() },
        { provide: getRepositoryToken(Course), useValue: createMockRepo() },
      ],
    }).compile();

    service = module.get(LessonsService);
    lessonsRepo = module.get(getRepositoryToken(Lesson));
    coursesRepo = module.get(getRepositoryToken(Course));
  });

  // ----------------------------------------
  // findAll
  // ----------------------------------------
  it('should return all lessons', async () => {
    const lessons = [{ id: '1', title: 'A' }] as Lesson[];
    lessonsRepo.find.mockResolvedValue(lessons);

    const result = await service.findAll();
    expect(result).toEqual(lessons);
    expect(lessonsRepo.find).toHaveBeenCalled();
  });

  // ----------------------------------------
  // create
  // ----------------------------------------
  it('should create a lesson successfully', async () => {
    const dto = {
      title: 'Lesson 1',
      content: 'content',
      videoUrl: 'https://youtube.com/lesson',
      courseId: '123',
    };

    const course = { id: '123' } as Course;

    coursesRepo.findOneBy.mockResolvedValue(course);
    lessonsRepo.create.mockReturnValue({
      ...dto,
      course,
    });

    lessonsRepo.save.mockResolvedValue({
      id: 'abc',
      ...dto,
      course,
    });

    const result = await service.create(dto);

    expect(result.id).toBe('abc');
    expect(coursesRepo.findOneBy).toHaveBeenCalledWith({ id: dto.courseId });
    expect(lessonsRepo.save).toHaveBeenCalled();
  });

  it('should throw error when creating a lesson with non-existent course', async () => {
    coursesRepo.findOneBy.mockResolvedValue(null);

    await expect(
      service.create({
        title: 'x',
        content: 'y',
        videoUrl: 'z',
        courseId: '404',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  // ----------------------------------------
  // findOne
  // ----------------------------------------
  it('should return an existing lesson', async () => {
    const lesson = { id: '1' } as Lesson;
    lessonsRepo.findOneBy.mockResolvedValue(lesson);

    const result = await service.findOne('1');
    expect(result).toEqual(lesson);
  });

  it('should throw if lesson does not exist', async () => {
    lessonsRepo.findOneBy.mockResolvedValue(null);

    await expect(service.findOne('1')).rejects.toBeInstanceOf(NotFoundException);
  });

  // ----------------------------------------
  // update
  // ----------------------------------------
  it('should update a lesson', async () => {
    const lesson = { id: '1', title: 'Old' } as Lesson;

    lessonsRepo.findOneBy.mockResolvedValue(lesson);
    lessonsRepo.save.mockResolvedValue({ ...lesson, title: 'New' });

    const result = await service.update('1', { title: 'New' });

    expect(result.title).toBe('New');
  });

  it('should throw when updating with a non-existent course', async () => {
    const lesson = { id: '1' } as Lesson;

    lessonsRepo.findOneBy.mockResolvedValue(lesson);
    coursesRepo.findOneBy.mockResolvedValue(null);

    await expect(service.update('1', { courseId: '999' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  // ----------------------------------------
  // remove
  // ----------------------------------------
  it('should remove a lesson', async () => {
    const lesson = { id: '1' } as Lesson;

    lessonsRepo.findOneBy.mockResolvedValue(lesson);
    lessonsRepo.remove.mockResolvedValue(lesson);

    const result = await service.remove('1');

    expect(result).toEqual(lesson);
    expect(lessonsRepo.remove).toHaveBeenCalled();
  });
});
