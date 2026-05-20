import request from 'supertest';
import app from '../app';
import { resetDb } from './test-utils';

beforeEach(() => {
  resetDb();
});

describe('Product API', () => {
  it('GET /api/products should return list of products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/products with search should filter results', async () => {
    const res = await request(app).get('/api/products').query({ search: 'iphone' });
    expect(res.status).toBe(200);
    expect(res.body.every((p: any) => /iphone/i.test(p.name))).toBe(true);
  });

  it('GET /api/products with sort=price should order ascending', async () => {
    const res = await request(app).get('/api/products').query({ sort: 'price' });
    expect(res.status).toBe(200);
    const prices = res.body.map((p: any) => p.price);
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  });

  it('GET /api/products with filter should filter by category', async () => {
    const res = await request(app).get('/api/products').query({ filter: 'iphone' });
    expect(res.status).toBe(200);
    expect(res.body.every((p: any) => p.category === 'iphone')).toBe(true);
  });
});

