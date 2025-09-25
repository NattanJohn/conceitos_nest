import { Injectable } from '@nestjs/common';
import { User } from './users.model';

@Injectable()
export class UsersService {
  private users: User[] = [];

  findAll() {
    return this.users;
  }

  create(user: { name: string; email: string }) {
    const newUser = { id: Date.now(), ...user };
    this.users.push(newUser);
    return newUser;
  }

  findOne(id: number) {
    return this.users.find((user) => user.id === id);
  }
}
