import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateUserDto): Promise<User> {
    return this.prismaService.user.create({ data: dto });
  }

  async findByEmail(email: string): Promise<User> {
    return this.prismaService.user.findUnique({ where: { email } });
  }
}
