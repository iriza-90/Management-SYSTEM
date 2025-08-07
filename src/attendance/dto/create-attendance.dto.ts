import { ApiProperty } from '@nestjs/swagger';

export class CreateAttendanceDto {
  @ApiProperty({ example: 1 })
  employeeId: number;

  @ApiProperty({ enum: ['IN', 'OUT'] })
  status: 'IN' | 'OUT';
}
