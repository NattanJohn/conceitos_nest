import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'O nome deve ser valido' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  readonly name: string;

  @IsEmail({}, { message: 'O email deve ser válido' })
  readonly email: string;
}
