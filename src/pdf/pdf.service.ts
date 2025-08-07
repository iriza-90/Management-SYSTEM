import { Injectable } from '@nestjs/common';
const PDFDocument = require('pdfkit');
import { Attendance } from 'src/attendance/attendance.entity';

@Injectable()
export class PdfService {
  async generateAttendanceReport(attendances: Attendance[]) {
    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));

    
    doc.fontSize(20).text('Attendance Report', { align: 'center' });
    doc.moveDown();

    
    doc.fontSize(12);
    doc.text('Employee Name', 50, doc.y, { continued: true });
    doc.text('Status', 200, doc.y, { continued: true });
    doc.text('Timestamp', 300, doc.y);
    doc.moveDown();

    attendances.forEach((att) => {
      doc.text(att.employee.name, 50, doc.y, { continued: true });
      doc.text(att.status, 200, doc.y, { continued: true });
      doc.text(att.timestamp.toISOString(), 300, doc.y);
      doc.moveDown();
    });

    doc.end();

    return new Promise<Buffer>((resolve) => {
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
    });
  }
}
