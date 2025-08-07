import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './attendance.entity';
import { Employee } from '../employee/employee.entity';
import { PdfService } from 'src/pdf/pdf.service';
import { ExcelService } from 'src/pdf/excel.service';
import { GrokService } from './grok.service';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, Employee])],
  controllers: [AttendanceController],
  providers: [AttendanceService, PdfService, ExcelService,GrokService],
})
export class AttendanceModule {}
