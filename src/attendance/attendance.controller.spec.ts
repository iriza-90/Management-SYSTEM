import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { PdfService } from 'src/pdf/pdf.service';
import { ExcelService } from 'src/pdf/excel.service';

class JwtAuthGuardMock {
  canActivate() {
    return true; // bypass auth in unit tests
  }
}

describe('AttendanceController', () => {
  let controller: AttendanceController;

  const attSvcMock = {
    recordAttendance: jest.fn(),
    getAllAttendance: jest.fn(),
    getAttendanceForEmployee: jest.fn(),
  };

  const pdfSvcMock = {
    generateAttendanceReport: jest.fn(),
  };

  const excelSvcMock = {
    generateAttendanceExcel: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceController],
      providers: [
        { provide: AttendanceService, useValue: attSvcMock },
        { provide: PdfService, useValue: pdfSvcMock },
        { provide: ExcelService, useValue: excelSvcMock },
      ],
    })
      // override the guard if controller uses @UseGuards(JwtAuthGuard)
      .overrideGuard((<any>Object)) // quick hack-free alternative is module.overrideProvider if you have actual JwtAuthGuard token
      .useValue(new JwtAuthGuardMock())
      .compile();

    controller = module.get(AttendanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
