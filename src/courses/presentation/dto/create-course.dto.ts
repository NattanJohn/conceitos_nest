import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório' })
  readonly title: string;

  @IsString()
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  readonly description: string;

  @IsString()
  @IsNotEmpty({ message: 'A thumbnail é obrigatória' })
  readonly thumbnail: string;

  @IsNumber()
  readonly instructorId: number;

  @IsNumber()
  readonly categoryId: number;
}
