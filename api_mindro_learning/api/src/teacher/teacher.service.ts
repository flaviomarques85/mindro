
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) { }

  create(data: Prisma.TeacherCreateInput) {
    return this.prisma.teacher.create({ data });
  }

  findAll() {
    return this.prisma.teacher.findMany();
  }

  findOne(id: string) {
    return this.prisma.teacher.findUnique({ where: { id } });
  }

  update(id: string, data: Prisma.TeacherUpdateInput) {
    return this.prisma.teacher.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.teacher.delete({ where: { id } });
  }

  async findByEmail(email: string) {
    const user = await this.prisma.teacher.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`No user found with email: ${email}`);
    }

    return user;
  }

  async findStudentsByTeacher(teacherId: string) {
    const students = await this.prisma.user.findMany({
      where: { teacherId: teacherId }
    });

    if (students.length === 0) {
      throw new NotFoundException(`No students found for teacher with ID: ${teacherId}`);
    }

    return students;
  }

  async findPaymentsByTeacher(teacherId: string) {
    const payments = await this.prisma.paymentHistory.findMany({
      where: { teacherId: teacherId },
    });

    return payments;
  }
}
