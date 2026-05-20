import request from 'supertest';
import app from '../app';
import { resetDb, readDb } from './test-utils';

beforeEach(() => {
  resetDb();
});

describe('Basket API', () => {
  it('GET /api/basket/:userId should return basket array (existing)', async () => {
    const res = await request(app).get('/api/basket/5');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(0);
  });

  it('GET /api/basket/:userId for missing user should return empty array', async () => {
    const res = await request(app).get('/api/basket/9999');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('POST /api/basket/:userId/update should replace basket and return it', async () => {
    const newBasket = [{ id: 42, name: 'Test Product' }];
    const res = await request(app)
      .post('/api/basket/3/update')
      .send(newBasket)
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].id).toBe(42);

    const db = JSON.parse(readDb('baskets.json') as string);
    expect(db.find((b:any)=>b.user_id===3).basket[0].id).toBe(42);
  });
});

