import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  async create(dto: CreateEmployeeDto) {
    const employee = this.employeeRepo.create(dto);
    return this.employeeRepo.save(employee);
  }

  async findAll() {
    return this.employeeRepo.find();
  }

  async findOne(id: number) {
    const emp = await this.employeeRepo.findOne({ where: { id } });
    if (!emp) throw new NotFoundException('Employee not found');
    return emp;
  }

  async update(id: number, dto: UpdateEmployeeDto) {
    const employee = await this.findOne(id);
    const updated = Object.assign(employee, dto);
    return this.employeeRepo.save(updated);
  }

  async remove(id: number) {
    const employee = await this.findOne(id);
    return this.employeeRepo.remove(employee);
  }
}
