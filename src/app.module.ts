import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'postgres',
      password: 'ihms@J1976',
      database: 'employ',
      autoLoadEntities: true,
      synchronize: true, 
    }),
    AuthModule,
    EmployeeModule,
    AttendanceModule,
  ],
})
export class AppModule {}
