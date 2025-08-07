import {Controller,Post,Body,Get,Param,UseGuards,Res,ParseIntPipe} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PdfService } from 'src/pdf/pdf.service';
import { Response } from 'express';
import { ExcelService } from 'src/pdf/excel.service';

@ApiTags('Attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(
    private readonly attendanceService: AttendanceService,
    private readonly pdfService: PdfService,
    private readonly excelService: ExcelService,
  ) {}

  @Post()
  async markAttendance(@Body() dto: CreateAttendanceDto) {
    return this.attendanceService.recordAttendance(dto);
  }

  @Get()
  async getAll() {
    return this.attendanceService.getAllAttendance();
  }

  @Get('employee/:employeeId')
  async getByEmployee(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ) {
    return this.attendanceService.getAttendanceForEmployee(employeeId);
  }

  @Get('report')
  async getReport(@Res() res: Response) {
    const attendances = await this.attendanceService.getAllAttendance();
    const pdfBuffer = await this.pdfService.generateAttendanceReport(
      attendances,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=attendance-report.pdf',
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }

  @Get('report/excel')
async getExcelReport(@Res() res: Response) {
  const attendances = await this.attendanceService.getAllAttendance();
  const excelBuffer = await this.excelService.generateAttendanceExcel(attendances);

  res.set({
    'Content-Type':
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Content-Disposition': 'attachment; filename=attendance-report.xlsx',
    'Content-Length': excelBuffer.length,
  });

  res.end(excelBuffer);
}
}
