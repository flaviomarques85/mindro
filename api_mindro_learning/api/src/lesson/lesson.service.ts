
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { format, parse } from 'date-fns';

@Injectable()
export class LessonService {
  constructor(private prisma: PrismaService) { }

  create(data: Prisma.LessonCreateInput) {
    if (data.time && typeof data.time === 'string') {
      const parsedTime = parse(data.time, 'HH:mm', new Date(0));
      data.time = parsedTime;
    }
    return this.prisma.lesson.create({ data });
  }

  findAll() {
    return this.prisma.lesson.findMany();
  }

  findOne(id: string) {
    return this.prisma.lesson.findUnique({ where: { id } });
  }

  update(id: string, data: Prisma.LessonUpdateInput) {
    if (data.time && typeof data.time === 'string') {
      const parsedTime = parse(data.time, 'HH:mm', new Date(0));
      data.time = parsedTime;
    }

    return this.prisma.lesson.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.lesson.delete({ where: { id } });
  }

  //Busca os aulas(lessons) do usuario especifico.
  findByUser(userId: string) {
    return this.prisma.lesson.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
      include: {
        language: true,
        teacher: true,
      },
    });
  }

  //Busca as aulas por uma Teacher especifico.
  async findByTeacher(teacherId: string) {
    const lessons = await this.prisma.lesson.findMany({
      where: { teacherId },
      orderBy: { date: 'desc' },
      include: {
        language: true,
        user: true,
      },
    });

    return lessons.map((lesson) => ({
      ...lesson,
      time: format(new Date(lesson.time), 'HH:mm'),
    }));
  }
}
