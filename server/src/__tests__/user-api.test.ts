import request from 'supertest';
import app from '../app';
import { resetDb, readDb } from './test-utils';

beforeEach(() => {
  resetDb();
});

describe('User API', () => {
  describe('POST /api/users/register', () => {
    it('should register a new user (201) and set cookie', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({ login: 'newuser', password: 'abcdef', repeatPassword: 'abcdef', phone: '+375 29 555 5555' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message');
      expect(res.headers['set-cookie']).toBeDefined();

      const users = JSON.parse(readDb('users.json') as string).users;
      expect(users.find((u:any)=>u.login==='newuser')).toBeDefined();
    });

    it('should return 400 when fields are missing', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({ login: 'x', password: '' });

      expect(res.status).toBe(400);
    });

    it('should return 400 for password mismatch', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({ login: 'x', password: '123456', repeatPassword: '654321', phone: '+375 29 555 5555' });
      expect(res.status).toBe(400);
    });

    it('should return 400 for invalid phone', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({ login: 'x2', password: '123456', repeatPassword: '123456', phone: '12345' });
      expect(res.status).toBe(400);
    });

    it('should return 400 for duplicate login', async () => {
      // admin exists in fixture
      const res = await request(app)
        .post('/api/users/register')
        .send({ login: 'admin', password: 'abcdef', repeatPassword: 'abcdef', phone: '+375 29 555 5555' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/users/login', () => {
    it('should login successfully and set cookie', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({ login: 'admin', password: '123321' });
      expect(res.status).toBe(200);
      expect(res.headers['set-cookie']).toBeDefined();
      expect(res.body).toHaveProperty('message');
    });

    it('should return 401 for wrong credentials', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({ login: 'admin', password: 'wrong' });
      expect(res.status).toBe(401);
    });

    it('should return 400 when fields are missing', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({ login: '', password: '' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/users/me', () => {
    it('should return 401 when no cookie', async () => {
      const res = await request(app).get('/api/users/me');
      expect(res.status).toBe(401);
    });

    it('should return profile when cookie set', async () => {
      // login first to get cookie
      const login = await request(app)
        .post('/api/users/login')
        .send({ login: 'admin', password: '123321' });

      const cookies = login.headers['set-cookie'];
      const res = await request(app).get('/api/users/me').set('Cookie', cookies);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('login');
    });
  });
});

