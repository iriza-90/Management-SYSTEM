import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard'; // adjust path to your guard

// Mock guard that always allows access
@Injectable()
class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    return true;
  }
}

describe('App E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard) // override the real guard
      .useClass(MockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/employee (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/employee') // make sure this matches your controller path
      .send({ name: 'Jane Doe', email: 'jane@example.com' })
      .expect(201);

    expect(res.body.name).toBe('Jane Doe');
    expect(res.body.email).toBe('jane@example.com');
  });

  it('/attendance (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/attendance') // match your controller
      .send({ employeeId: 1, status: 'IN' })
      .expect(201);

    expect(res.body.status).toBe('IN');
    expect(res.body.employeeId).toBe(1);
  });

  afterAll(async () => {
    await app.close();
  });
});
