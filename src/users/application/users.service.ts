import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../infrastructure/entities/user.entity';
import { UpdateUserDto } from '../presentation/dto/update-user.dto';
import { CreateUserDto } from '../presentation/dto/create-user.dto';

@Injectable()
export class UsersService {
  private users: User[] = [];

  findAll() {
    if (this.users.length === 0) {
      throw new NotFoundException('Nenhum usuário cadastrado');
    }
    return this.users;
  }
  create(user: CreateUserDto): User {
    const newUser: User = { id: Date.now(), ...user };
    this.users.push(newUser);
    return newUser;
  }

  findOne(id: number) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`Usuario nao encontrado`);
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto): User {
    const user = this.findOne(id);
    Object.assign(user, updateUserDto);
    return user;
  }

  remove(id: number): User {
    const index = this.users.findIndex((user) => user.id === id);

    if (index === -1) {
      throw new NotFoundException(`Usuário não encontrado`);
    }

    const deletedUser = this.users[index];
    this.users.splice(index, 1);
    return deletedUser;
  }
}
