
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('courses')
@Controller('courses')
export class CourseController {
  constructor(private readonly service: CourseService) { }

  @Post()
  create(@Body() dto: CreateCourseDto) {
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

  @Get('user/:userId/status/:status')
  findByUserAndStatus(
    @Param('userId') userId: string,
    @Param('status') status: string,
  ) {
    return this.service.findByUserAndStatus(userId, status);
  }
  //by user id
  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.service.findByUserId(userId);
  }


  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
