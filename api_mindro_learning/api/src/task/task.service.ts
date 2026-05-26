import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateTaskDto) {
    return this.prisma.task.create({ data });
  }

  async findAll() {
    return this.prisma.task.findMany({ include: { user: true, teacher: true } });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`No task found with id: ${id}`);
    }
    return task;
  }
  async findByUser(userId: string) {
    return this.prisma.task.findMany({
      where: { userId },
      include: { teacher: true },
    });
  }

  async update(id: string, data: UpdateTaskDto) {
    return this.prisma.task.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.task.delete({ where: { id } });
  }

  async updateProgress(taskId: string, progress: number) {
    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        progress: progress,
        status: progress >= 100 ? 'Completed' : 'In Progress',
      },
    });
  }

  //Busca as tarefas por uma Teacher especifico.
  findByTeacher(teacherId: string) {
    return this.prisma.task.findMany({
      where: { teacherId },
      include: { user: true, teacher: true },
    });
  }

}