import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller'
import { AppService } from './app.service';
import { PrismaModule } from '../database/prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TeacherModule } from './teacher/teacher.module'
import { CourseModule } from './course/course.module';
import { LessonModule } from './lesson/lesson.module';
import { PaymentModule } from './payment/payment.module';
import { TaskModule } from './task/task.module';
import { LlmModule } from './llm/llm.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    AuthModule,
    TeacherModule,
    CourseModule,
    LessonModule,
    PaymentModule,
    TaskModule,
    LlmModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
