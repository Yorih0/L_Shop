import fs from 'fs/promises';
import path from 'path';
import { User, RegisterRequest } from '../types/User';
import { login } from '../controllers/userController';

const DB_PATH = path.join(__dirname, '../db/users.json');

interface Database {
    users: User[];
}

export const readDB = async (): Promise<Database> => {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        const parsed = JSON.parse(data);

        return {
            users: Array.isArray(parsed.users) ? parsed.users : []
        };
    } catch (error) {
        return { users: [] };
    }
};


export const writeDB = async (data: Database): Promise<void> => {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
};

export const findUserByLogin = async (login: string): Promise<User | undefined> => {
    const db = await readDB();
    return db.users.find(user => user.login === login);
};

export const createUser = async (userData: RegisterRequest): Promise<User> => {
    const db = await readDB();
    
    const hashedPassword = userData.password;
    
    const newUser: User = {
        id: db.users.length + 1,
        login: userData.login,
        password: hashedPassword,
        phone: userData.phone,
        role: "user"
    };
    
    db.users.push(newUser);
    await writeDB(db);
    
    return newUser;
};

export const validateUser = async (login: string, password: string): Promise<User | null> => {
    const user = await findUserByLogin(login);
    
    if (!user) return null;
    
    const isValid = password === user.password;
    
    return isValid ? user : null;
};

export const updateUserByRole = async (id: number,role: "user" | "admin" | "manager"): Promise<User | null> => {
    const db = await readDB();

    const userIndex = db.users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;

    db.users[userIndex].role = role;

    await writeDB(db);

    return db.users[userIndex];
};

export const getUserById = async (id: number): Promise<User | null> => {
    const db = await readDB();

    const user = db.users.find(u => u.id === id);

    return user || null;
};