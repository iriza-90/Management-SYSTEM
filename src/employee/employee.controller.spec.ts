import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';

describe('EmployeeController', () => {
  let employeeController: EmployeeController;
  const mockEmployeeService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        { provide: EmployeeService, useValue: mockEmployeeService },
      ],
    }).compile();

    employeeController = module.get<EmployeeController>(EmployeeController);
  });

  it('should be defined', () => {
    expect(employeeController).toBeDefined();
  });
});
