import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Employee } from '../employee/employee.entity';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, { eager: true })
  employee: Employee;

  @Column()
  status: 'IN' | 'OUT';

  @CreateDateColumn()
  timestamp: Date;
}
