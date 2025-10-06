import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateEnrollmentDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  courseId: string;
}
