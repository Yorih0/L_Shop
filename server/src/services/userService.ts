import fs from 'fs/promises';
import path from 'path';
import { User, RegisterRequest } from '../types/User';

const DB_PATH = path.join(__dirname, '../db/users.json');

interface Database {
    users: User[];
}

/**
 * Прочитать базу пользователей
 * @returns {Promise<{ users: User[] }>} объект с пользователями
 */
export const readDB = async (): Promise<Database> => {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch {
        return { users: [] };
    }
};

/**
 * Записать данные в базу
 * @param {Database} data - данные для сохранения
 * @returns {Promise<void>}
 */
export const writeDB = async (data: Database): Promise<void> => {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
};

/**
 * Найти пользователя по логину
 * @param {string} login - логин пользователя
 * @returns {Promise<User | undefined>} найденный пользователь
 */
export const findUserByLogin = async (login: string): Promise<User | undefined> => {
    const db = await readDB();
    return db.users.find(user => user.login === login);
};

/**
 * Создать нового пользователя
 * @param {RegisterRequest} userData - данные для регистрации
 * @returns {Promise<User>} созданный пользователь
 */
export const createUser = async (userData: RegisterRequest): Promise<User> => {
    const db = await readDB();

    const newUser: User = {
        id: db.users.length + 1,
        login: userData.login,
        password: userData.password,
        phone: userData.phone,
        role: "user"
    };

    db.users.push(newUser);
    await writeDB(db);

    return newUser;
};

/**
 * Проверить пользователя (логин + пароль)
 * @param {string} login - логин
 * @param {string} password - пароль
 * @returns {Promise<User | null>} пользователь или null
 */
export const validateUser = async (login: string, password: string): Promise<User | null> => {
    const user = await findUserByLogin(login);

    if (!user) return null;

    const isValid = password === user.password;

    return isValid ? user : null;
};