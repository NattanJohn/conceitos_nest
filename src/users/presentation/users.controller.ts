import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from '../application/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../infrastructure/entities/user.entity';
import { JwtAuthGuard } from '../../auth/domain/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/infrastructure/guards/roles.guards';
import { Roles } from '../../auth/infrastructure/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  @Roles('admin', 'teacher', 'student')
  async findOne(@Param('id') id: string, @Req() req: Request): Promise<User> {
    const user = await this.usersService.findOne(id);
    const currentUser = req.user as { sub: string; role: string };

    if (currentUser.role !== 'admin' && currentUser.sub !== user.id) {
      throw new ForbiddenException('Você não tem permissão para ver este perfil');
    }

    return user;
  }

  @Put(':id')
  @Roles('admin', 'teacher', 'student')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ): Promise<User> {
    const currentUser = req.user as { sub: string; role: string };

    if (currentUser.role !== 'admin' && currentUser.sub !== id) {
      throw new ForbiddenException('Você não tem permissão para atualizar este perfil');
    }

    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(id);
  }
}
