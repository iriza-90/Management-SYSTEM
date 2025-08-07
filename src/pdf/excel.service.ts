import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Attendance } from 'src/attendance/attendance.entity';

@Injectable()
export class ExcelService {
  async generateAttendanceExcel(attendances: Attendance[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance');

    // Header row
    worksheet.columns = [
      { header: 'Employee Name', key: 'name', width: 25 },
      { header: 'Status', key: 'status', width: 10 },
      { header: 'Timestamp', key: 'timestamp', width: 30 },
    ];

    // Data rows
    attendances.forEach((att) => {
      worksheet.addRow({
        name: att.employee.name,
        status: att.status,
        timestamp: att.timestamp.toISOString(),
      });
    });

    // Convert ArrayBuffer to Node.js Buffer
    const arrayBuffer = await workbook.xlsx.writeBuffer();
    const nodeBuffer = Buffer.from(arrayBuffer as ArrayBuffer); // 👈🏽 This fixes the TS error

    return nodeBuffer;
  }
}
