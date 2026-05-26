
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('lessons')
@Controller('lessons')
export class LessonController {
  constructor(private readonly service: LessonService) { }

  @Post()
  create(@Body() dto: CreateLessonDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  //Busca os curdos do usuario especifico.
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.service.findByUser(userId);
  }

  //Busca as aulas por uma Teacher especifico.
  @Get('teacher/:teacherId')
  findByTeacher(@Param('teacherId') teacherId: string) {
    return this.service.findByTeacher(teacherId);
  }
}
