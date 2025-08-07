import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  @MinLength(6)
  newPassword: string;
}
