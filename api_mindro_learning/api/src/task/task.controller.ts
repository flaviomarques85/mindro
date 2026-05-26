import { Controller, Get, Post, Body, Param, Put, Delete, Patch } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.taskService.findByUser(userId);
  }


  @Put(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }

  @Patch('/update-progress/:taskId')
  @ApiOperation({ summary: 'Update task progress by task ID' })
  updateProgress(
    @Param('taskId') taskId: string,
    @Body() body: { progress: number }
  ) {
    return this.taskService.updateProgress(taskId, body.progress);
  }

  //Busca as tarefas por uma Teacher especifico.
  @Get('teacher/:teacherId')
  findByTeacher(@Param('teacherId') teacherId: string) {
    return this.taskService.findByTeacher(teacherId);
  }

}