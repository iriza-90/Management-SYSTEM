import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('App E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/employees (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/employees')
      .send({ name: 'Jane Doe', email: 'jane@example.com' })
      .expect(201);

    expect(res.body.name).toBe('Jane Doe');
  });

  it('/attendance (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/attendance')
      .send({ employeeId: 1, status: 'IN' })
      .expect(201);

    expect(res.body.status).toBe('IN');
  });

  afterAll(async () => {
    await app.close();
  });
});
