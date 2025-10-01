import { PartialType } from '@nestjs/mapped-types';
import { CreateLessonDto } from './create-lasson.dto';

export class UpdateLessonDto extends PartialType(CreateLessonDto) {}
