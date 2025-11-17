/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from '../courses.service';
import { Repository } from 'typeorm';
import { Course } from '../../infrasctruture/entities/course.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { User } from '../../../users/infrastructure/entities/user.entity';
import { Category } from '../../../categories/infrastructure/entities/category.entity';
import * as fs from 'fs';

jest.mock('fs');

describe('CoursesService', () => {
  let service: CoursesService;
  let coursesRepository: jest.Mocked<Repository<Course>>;

  const mockUser: User = {
    id: '10',
    name: 'Instructor',
  } as User;

  const mockCategory: Category = {
    id: '20',
    name: 'Category',
  } as Category;

  const mockCourse: Course = {
    id: '1',
    title: 'Test Course',
    description: 'Desc',
    thumbnail: 'thumb.png',
    instructor: mockUser,
    instructorId: '10',
    category: mockCategory,
    categoryId: '20',
    createdAt: new Date(),
    updatedAt: new Date(),
    lessons: [],
    enrollments: [],
  } as Course;

  const mockManager = {
    findOne: jest.fn(),
  };

  const mockCoursesRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    manager: mockManager,
  } as unknown as jest.Mocked<Repository<Course>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: getRepositoryToken(Course),
          useValue: mockCoursesRepository,
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    coursesRepository = module.get(getRepositoryToken(Course));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------------- findAll --------------------------------
  it('should return courses list', async () => {
    coursesRepository.find.mockResolvedValue([mockCourse]);

    const result = await service.findAll();
    expect(result).toEqual([mockCourse]);
    expect(coursesRepository.find).toHaveBeenCalled();
  });

  it('should throw NotFoundException when no courses found', async () => {
    coursesRepository.find.mockResolvedValue([]);

    await expect(service.findAll()).rejects.toThrow(NotFoundException);
  });

  // -------------------------------- create --------------------------------
  it('should create a new course', async () => {
    const dto = {
      title: 'Test',
      description: 'x',
      instructorId: '10',
      categoryId: '20',
    };

    mockManager.findOne.mockImplementation((entity) => {
      if (entity === User) return mockUser;
      if (entity === Category) return mockCategory;
      return null;
    });

    coursesRepository.create.mockReturnValue(mockCourse);
    coursesRepository.save.mockResolvedValue(mockCourse);

    const result = await service.create(dto);

    expect(mockManager.findOne).toHaveBeenCalledTimes(2);
    expect(coursesRepository.save).toHaveBeenCalled();
    expect(result).toEqual(mockCourse);
  });

  it('should throw NotFoundException when instructor not found', async () => {
    const dto = { title: 'X', description: 'Y', instructorId: '10', categoryId: '20' };

    mockManager.findOne.mockResolvedValueOnce(null);

    await expect(service.create(dto)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException when category not found', async () => {
    const dto = { title: 'X', description: 'Y', instructorId: '10', categoryId: '20' };

    mockManager.findOne.mockResolvedValueOnce(mockUser).mockResolvedValueOnce(null);

    await expect(service.create(dto)).rejects.toThrow(NotFoundException);
  });

  // -------------------------------- findOne --------------------------------
  it('should return one course', async () => {
    coursesRepository.findOneBy.mockResolvedValue(mockCourse);

    const result = await service.findOne('1');
    expect(result).toEqual(mockCourse);
  });

  it('should throw NotFoundException when course not found', async () => {
    coursesRepository.findOneBy.mockResolvedValue(null);

    await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
  });

  // -------------------------------- update --------------------------------
  it('should update a course', async () => {
    const dto = { title: 'Updated' };

    coursesRepository.findOneBy.mockResolvedValue(mockCourse);
    coursesRepository.save.mockResolvedValue({ ...mockCourse, ...dto });

    const result = await service.update('1', dto);

    expect(result.title).toBe('Updated');
    expect(coursesRepository.save).toHaveBeenCalled();
  });

  // -------------------------------- remove --------------------------------
  it('should remove a course', async () => {
    coursesRepository.findOneBy.mockResolvedValue(mockCourse);
    coursesRepository.remove.mockResolvedValue(mockCourse);

    const result = await service.remove('1');

    expect(result).toEqual(mockCourse);
    expect(coursesRepository.remove).toHaveBeenCalled();
  });

  // ------------------------------ updateThumbnail ---------------------------
  it('should update thumbnail and delete old file if exists', async () => {
    const courseWithThumb = {
      ...mockCourse,
      thumbnail: 'old.png',
    };

    coursesRepository.findOneBy.mockResolvedValue(courseWithThumb);
    coursesRepository.save.mockResolvedValue({ ...courseWithThumb, thumbnail: 'new.png' });

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'unlinkSync').mockImplementation(() => {});

    const result = await service.updateThumbnail('1', 'new.png');

    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.unlinkSync).toHaveBeenCalled();
    expect(result.thumbnail).toBe('new.png');
  });

  it('should update thumbnail without deleting if file does NOT exist', async () => {
    const courseWithThumb = {
      ...mockCourse,
      thumbnail: 'old.png',
    };

    coursesRepository.findOneBy.mockResolvedValue(courseWithThumb);
    coursesRepository.save.mockResolvedValue({ ...courseWithThumb, thumbnail: 'new.png' });

    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    jest.spyOn(fs, 'unlinkSync').mockImplementation(() => {});

    const result = await service.updateThumbnail('1', 'new.png');

    expect(fs.unlinkSync).not.toHaveBeenCalled();
    expect(result.thumbnail).toBe('new.png');
  });
});
