import { ProductService } from '../services/productService';
import { resetDb } from './test-utils';

beforeEach(() => resetDb());

describe('ProductService', () => {
  it('getAllProductds returns array', () => {
    const all = ProductService.getAllProductds();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBeGreaterThan(0);
  });

  it('getFilterProducts search filters by name', () => {
    const res = ProductService.getFilterProducts('iphone', undefined, undefined);
    expect(res.every(p => /iphone/i.test(p.name))).toBe(true);
  });

  it('getFilterProducts filter filters by category', () => {
    const res = ProductService.getFilterProducts(undefined, 'iphone', undefined);
    expect(res.every(p => p.category === 'iphone')).toBe(true);
  });

  it('getFilterProducts sort by price asc', () => {
    const res = ProductService.getFilterProducts(undefined, undefined, 'price');
    for (let i = 1; i < res.length; i++) {
      expect(res[i].price).toBeGreaterThanOrEqual(res[i - 1].price);
    }
  });

  it('getProductsId returns matching ids', () => {
    const all = ProductService.getAllProductds();
    const ids = all.slice(0, 1).map(p=>p.id);
    const res = ProductService.getProductsId(ids);
    expect(res.length).toBe(ids.length);
    expect(res[0].id).toBe(ids[0]);
  });
});

