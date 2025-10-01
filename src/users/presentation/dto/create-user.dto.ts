import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'O nome deve ser valido' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  readonly name: string;

  @IsEmail({}, { message: 'O email deve ser válido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  readonly email: string;

  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  role: string;
}
