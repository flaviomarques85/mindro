
import { addDays } from 'date-fns';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.UserCreateInput) {
    const userData: Prisma.UserCreateInput = {
      ...data,
      nextDueDate:
        'nextDueDate' in data && data.nextDueDate
          ? data.nextDueDate
          : addDays(new Date(), 30),
    };

    return this.prisma.user.create({ data: userData });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`No user found with email: ${email}`);
    }

    return user;
  }

}
