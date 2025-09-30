import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  thumbnail?: string;

  @IsUUID()
  instructorId: string;

  @IsUUID()
  categoryId: string;
}
