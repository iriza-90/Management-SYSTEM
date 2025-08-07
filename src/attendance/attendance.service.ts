import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity';
import { Employee } from '../employee/employee.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { transporter } from 'src/utils/mailer';
import * as dotenv from 'dotenv';
import { GrokService } from './grok.service'; 

dotenv.config();

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,

    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,

    private readonly grokService: GrokService, 
  ) {}

  async recordAttendance(dto: CreateAttendanceDto) {
    const employee = await this.employeeRepo.findOne({
      where: { id: dto.employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const attendance = this.attendanceRepo.create({
      employee,
      status: dto.status,
      timestamp: new Date(),
    });

    const savedAttendance = await this.attendanceRepo.save(attendance);

    await this.sendAttendanceEmail(
      employee.email,
      employee.name,
      dto.status === 'IN' ? savedAttendance.timestamp.toISOString() : '',
      dto.status === 'OUT' ? savedAttendance.timestamp.toISOString() : undefined,
    );

    return savedAttendance;
  }

  private async sendAttendanceEmail(
    employeeEmail: string,
    employeeName: string,
    clockIn: string,
    clockOut?: string,
  ) {
    const status = clockIn ? 'IN' : 'OUT';
    const timestamp = clockIn || clockOut || new Date().toISOString();

   
    const aiMessage = await this.grokService.generateAttendanceEmail(
      employeeName,
      status,
      timestamp,
    );

    const mailOptions = {
      from: `"Boss 🤭" <${process.env.GMAIL_USER}>`,
      to: employeeEmail,
      subject: `Attendance Recorded for ${employeeName}`,
      text: aiMessage,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ', info.response);
    } catch (error) {
      console.error('Error sending email: ', error);
    }
  }

  async getAllAttendance() {
    return this.attendanceRepo.find({
      relations: ['employee'],
      order: { timestamp: 'DESC' },
    });
  }

  async getAttendanceForEmployee(employeeId: number) {
    return this.attendanceRepo.find({
      where: { employee: { id: employeeId } },
      relations: ['employee'],
      order: { timestamp: 'DESC' },
    });
  }
}
