import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from './employee.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Employee } from './employee.entity';
import { Repository } from 'typeorm';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let repo: jest.Mocked<Repository<Employee>>;

  const repoMock = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<Repository<Employee>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: getRepositoryToken(Employee),
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get(EmployeeService);
    repo = module.get(getRepositoryToken(Employee));
    jest.clearAllMocks();
  });

  it('should create a new employee', async () => {
    const dto = { name: 'John Doe', email: 'john@example.com', position: 'Dev', phone: '123' } as any;
    const entity = { id: 1, ...dto };

    repo.create.mockReturnValue(entity);
    repo.save.mockResolvedValue(entity);

    const result = await service.create(dto);

    expect(result).toEqual(entity);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalledWith(entity);
  });
});
