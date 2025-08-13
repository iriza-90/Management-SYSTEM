import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ExecutionContext } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';
import { transporter } from '../src/utils/mailer';

jest.setTimeout(30000); // 30s timeout for E2E tests

describe('App E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // Bypass JwtAuthGuard
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      // Mock transporter
      .overrideProvider(transporter)
      .useValue({
        sendMail: jest.fn().mockResolvedValue(true),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/employee (POST) should create employee', async () => {
    const res = await request(app.getHttpServer())
      .post('/employee')
      .send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        position: 'Developer', 
      })
      .expect(201);

    expect(res.body.name).toBe('Jane Doe');
    expect(res.body.email).toBe('jane@example.com');
    expect(res.body.position).toBe('Developer');
  });

  it('/attendance (POST) should record attendance', async () => {
    const res = await request(app.getHttpServer())
      .post('/attendance')
      .send({ employeeId: 1, status: 'IN' })
      .expect(201);

    expect(res.body.employee.id).toBe(1);
    expect(res.body.status).toBe('IN');
  });
});
