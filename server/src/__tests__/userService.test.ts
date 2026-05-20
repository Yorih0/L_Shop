import { findUserByLogin, createUser, validateUser, readDB, writeDB } from '../services/userService';
import { resetDb, readDb as rdb } from './test-utils';

beforeEach(() => {
  resetDb();
});

describe('userService unit tests', () => {
  it('findUserByLogin should find existing user', async () => {
    const user = await findUserByLogin('admin');
    expect(user).toBeDefined();
    expect(user?.login).toBe('admin');
  });

  it('validateUser should return user for correct credentials', async () => {
    const user = await validateUser('admin', '123321');
    expect(user).not.toBeNull();
  });

  it('validateUser should return null for wrong password', async () => {
    const user = await validateUser('admin', 'wrong');
    expect(user).toBeNull();
  });

  it('createUser should add a new user', async () => {
    const before = JSON.parse(rdb('users.json') as string).users.length;
    const newUser = await createUser({ login: 'test-u', password: 'pass', repeatPassword: 'pass', phone: '+375 29 000 0000' });
    const after = JSON.parse(rdb('users.json') as string).users.length;
    expect(after).toBe(before + 1);
    expect(newUser.login).toBe('test-u');
  });

  it('createUser should assign incremental id', async () => {
    const newUser = await createUser({ login: 'test-u2', password: 'p', repeatPassword: 'p', phone: '+375 29 000 0001' });
    expect(newUser.id).toBeGreaterThan(0);
  });
});

