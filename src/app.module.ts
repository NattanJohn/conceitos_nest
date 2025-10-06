import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './categories/category.module';
import { LessonsModule } from './lessons/lessons.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    CoursesModule,
    CategoriesModule,
    LessonsModule,
    EnrollmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
