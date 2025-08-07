import { Injectable, UnauthorizedException, ConflictException, NotFoundException,BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as crypto from 'crypto'
import { MoreThan } from 'typeorm';
import { transporter } from 'src/utils/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existingUser) throw new ConflictException('Email already exists');

    const hashed = await bcrypt.hash(dto.password, 10);
     const user = this.userRepo.create({
    name: dto.name, 
    email: dto.email,
    password: hashed,
  });
    await this.userRepo.save(user);
    return { message: 'User registered successfully' };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
  const user = await this.userRepo.findOne({ where: { email: dto.email } });
  if (!user) throw new NotFoundException('No user found with that email');

  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 1000 * 60 * 15); // 15 min

  user.resetToken = token;
  user.resetTokenExpiry = expiry;
  await this.userRepo.save(user);

  const resetLink = `http://localhost:3000/reset-password?token=${token}`;

  await transporter.sendMail({
    from: '"EmployeeApp" <noreply@employeeapp.com>',
    to: user.email,
    subject: 'Password Reset',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Token valid for 15 minutes.</p>`,
  });

  return { message: 'Reset link sent to email' };
}

async resetPassword(dto: ResetPasswordDto) {
  const user = await this.userRepo.findOne({
    where: {
      resetToken: dto.token,
      resetTokenExpiry: MoreThan(new Date()),
    },
  });

  if (!user) throw new BadRequestException('Token is invalid or expired');

  user.password = await bcrypt.hash(dto.newPassword, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await this.userRepo.save(user);

  return { message: 'Password reset successfully' };
}
}
