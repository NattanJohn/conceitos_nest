import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateLessonDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsNotEmpty()
  @IsUUID()
  courseId: string;
}
