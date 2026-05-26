
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Prisma, CourseStatus } from '@prisma/client';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) { }

  create(data: Prisma.CourseCreateInput) {
    return this.prisma.course.create({ data });
  }

  findAll() {
    return this.prisma.course.findMany();
  }

  findOne(id: string) {
    return this.prisma.course.findUnique({ where: { id } });
  }

  update(id: string, data: Prisma.CourseUpdateInput) {
    return this.prisma.course.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.course.delete({ where: { id } });
  }

  findByUserAndStatus(userId: string, status: string) {
    return this.prisma.course.findMany({
      where: {
        userId,
        status: status as CourseStatus,
      },
      orderBy: { level: 'asc' }, // ordena por nível
      include: {
        language: true,
      },
    });
  }
  //by user id
  findByUserId(userId: string) {
    return this.prisma.course.findMany({
      where: { userId },
    });
  }

}
