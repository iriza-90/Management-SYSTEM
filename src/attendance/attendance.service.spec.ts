import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AttendanceService } from './attendance.service';
import { Attendance } from './attendance.entity';
import { Employee } from '../employee/employee.entity';
import { GrokService } from './grok.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('AttendanceService', () => {
  let service: AttendanceService;
  let attendanceRepo: Repository<Attendance>;
  let employeeRepo: Repository<Employee>;
  let grokService: GrokService;

  const attRepoMock = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const empRepoMock = {
    findOne: jest.fn(),
  };

  const grokServiceMock = {
    generateAttendanceEmail: jest.fn().mockResolvedValue('AI email message'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        { provide: getRepositoryToken(Attendance), useValue: attRepoMock },
        { provide: getRepositoryToken(Employee), useValue: empRepoMock },
        { provide: GrokService, useValue: grokServiceMock },
      ],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
    attendanceRepo = module.get<Repository<Attendance>>(getRepositoryToken(Attendance));
    employeeRepo = module.get<Repository<Employee>>(getRepositoryToken(Employee));
    grokService = module.get<GrokService>(GrokService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should record attendance', async () => {
    const dto: CreateAttendanceDto = { employeeId: 1, status: 'IN' };
    const employee = { id: 1, name: 'Alice', email: 'alice@test.com' };
    const savedAttendance = { id: 1, employee, status: 'IN', timestamp: new Date() };

    empRepoMock.findOne.mockResolvedValue(employee);
    attRepoMock.create.mockReturnValue(savedAttendance);
    attRepoMock.save.mockResolvedValue(savedAttendance);

    const result = await service.recordAttendance(dto);

    expect(empRepoMock.findOne).toHaveBeenCalledWith({ where: { id: dto.employeeId } });
    expect(attRepoMock.create).toHaveBeenCalledWith({
      employee,
      status: dto.status,
      timestamp: expect.any(Date),
    });
    expect(attRepoMock.save).toHaveBeenCalledWith(savedAttendance);
    expect(result).toEqual(savedAttendance);
    expect(grokServiceMock.generateAttendanceEmail).toHaveBeenCalledWith(
      employee.name,
      'IN',
      savedAttendance.timestamp.toISOString(),
    );
  });

  it('should throw NotFoundException if employee not found', async () => {
    const dto: CreateAttendanceDto = { employeeId: 999, status: 'IN' };
    empRepoMock.findOne.mockResolvedValue(undefined);

    await expect(service.recordAttendance(dto)).rejects.toThrow(NotFoundException);
  });
});
