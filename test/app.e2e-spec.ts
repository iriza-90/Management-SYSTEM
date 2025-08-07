import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Attendance E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should record clock-in', async () => {
    const payload = {
      employeeId: 1,
      status: 'IN',
    };

    const res = await request(app.getHttpServer())
      .post('/attendance')
      .send(payload)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.status).toBe('IN');
  });

  it('should record clock-out', async () => {
    const payload = {
      employeeId: 1,
      status: 'OUT',
    };

    const res = await request(app.getHttpServer())
      .post('/attendance')
      .send(payload)
      .expect(201);

    expect(res.body.status).toBe('OUT');
  });

  it('should return 400 for invalid status', async () => {
    const payload = {
      employeeId: 1,
      status: 'BREAKFAST',
    };

    await request(app.getHttpServer())
      .post('/attendance')
      .send(payload)
      .expect(400);
  });
});
