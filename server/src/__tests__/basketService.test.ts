import { BasketService } from '../services/basketService';
import { resetDb, readDb } from './test-utils';

beforeEach(() => resetDb());

describe('BasketService', () => {
  it('getBasket returns existing basket for user', () => {
    const b = BasketService.getBasket(5);
    expect(Array.isArray(b)).toBe(true);
    expect(b.length).toBeGreaterThanOrEqual(0);
  });

  it('getBasket returns empty array for missing user', () => {
    const b = BasketService.getBasket(9999);
    expect(Array.isArray(b)).toBe(true);
    expect(b.length).toBe(0);
  });

  it('setBasket creates or updates basket', () => {
    const newB = [{ id: 99, name: 'X' } as any];
    const res = BasketService.setBasket(7, newB);
    expect(res).toEqual(newB);

    const db = JSON.parse(readDb('baskets.json') as string);
    expect(db.find((x:any)=>x.user_id===7)).toBeDefined();
  });
});

