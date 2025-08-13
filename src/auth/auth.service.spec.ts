import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: jest.Mocked<Repository<User>>;
  let jwt: jest.Mocked<JwtService>;

  const userRepoMock = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  } as unknown as jest.Mocked<Repository<User>>;

  const jwtMock = {
    sign: jest.fn().mockReturnValue('fake.jwt.token'),
    verify: jest.fn(),
  } as unknown as jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: userRepoMock },
        { provide: JwtService, useValue: jwtMock },
      ],
    }).compile();

    service = module.get(AuthService);
    userRepo = module.get(getRepositoryToken(User));
    jwt = module.get(JwtService);
    jest.clearAllMocks();
  }); 

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // add more tests for register/login/forgot/reset using the mocks
});
