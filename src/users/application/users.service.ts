import { Injectable, NotAcceptableException } from '@nestjs/common';
import { User } from '../domain/users.model';
import { UpdateUserDto } from '../presentation/dto/update-user.dto';

@Injectable()
export class UsersService {
  private users: User[] = [];

  findAll() {
    if (this.users.length === 0) {
      throw new NotAcceptableException('Nenhum usuário cadastrado');
    }
    return this.users;
  }
  create(user: { name: string; email: string }) {
    const newUser = { id: Date.now(), ...user };
    this.users.push(newUser);
    return newUser;
  }

  findOne(id: number) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotAcceptableException(`Usuario ${id} nao encontrado`);
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto): User {
    const user = this.findOne(id);
    Object.assign(user, updateUserDto);
    return user;
  }
}
