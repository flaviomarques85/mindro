
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('teachers')
@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) { }

  @Post()
  create(@Body() dto: CreateTeacherDto) {
    return this.teacherService.create(dto);
  }

  @Get()
  findAll() {
    return this.teacherService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teacherService.findOne(id);
  }
  // Método para buscar professor por email
  // O email é passado como parâmetro de rota, então deve ser decodificado
  // para lidar com caracteres especiais como '%40' para '@'
  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    const decodedEmail = decodeURIComponent(email);
    return this.teacherService.findByEmail(decodedEmail);
  }

  // Método para buscar todos os alunos de um professor
  @Get(':id/students')
  findStudentsByTeacher(@Param('id') teacherId: string) {
    return this.teacherService.findStudentsByTeacher(teacherId);
  }
  // Método para buscar todos os pagamentos de um professor
  @Get(':id/payments')
  findPaymentsByTeacher(@Param('id') teacherId: string) {
    return this.teacherService.findPaymentsByTeacher(teacherId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTeacherDto) {
    return this.teacherService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teacherService.remove(id);
  }
}
