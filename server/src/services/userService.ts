// server/src/services/userService.ts (РАСШИРЕННАЯ ВЕРСИЯ)
import fs from 'fs/promises';
import path from 'path';
import { User, RegisterRequest } from '../types/User';

const DB_PATH = path.join(__dirname, '../db/users.json');

/**
 * Интерфейс структуры базы данных пользователей
 * @interface Database
 * @property {User[]} users - Массив всех пользователей
 */
interface Database {
    users: User[];
}

/**
 * Читает базу данных пользователей из файла
 * @async
 * @function readDB
 * @returns {Promise<Database>} Объект с массивом пользователей
 * @throws {Error} При ошибке чтения файла
 * 
 * @example
 * const db = await readDB();
 * console.log(`Всего пользователей: ${db.users.length}`);
 * 
 * @example
 * // Обработка ошибок
 * try {
 *   const db = await readDB();
 * } catch (error) {
 *   console.error('Ошибка чтения БД:', error);
 * }
 */
export const readDB = async (): Promise<Database> => {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // Если файл не существует, возвращаем пустую базу
        return { users: [] };
    }
};

/**
 * Записывает базу данных пользователей в файл
 * @async
 * @function writeDB
 * @param {Database} data - Объект с массивом пользователей для сохранения
 * @returns {Promise<void>}
 * @throws {Error} При ошибке записи в файл
 * 
 * @example
 * const db = { users: [newUser] };
 * await writeDB(db);
 * 
 * @example
 * // Обновление существующей БД
 * const db = await readDB();
 * db.users.push(newUser);
 * await writeDB(db);
 */
export const writeDB = async (data: Database): Promise<void> => {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
};

/**
 * Находит пользователя по логину
 * @async
 * @function findUserByLogin
 * @param {string} login - Логин пользователя (уникальный идентификатор)
 * @returns {Promise<User | undefined>} Найденный пользователь или undefined, если не найден
 * 
 * @example
 * const user = await findUserByLogin('john_doe');
 * if (user) {
 *   console.log(`Пользователь найден: ${user.id}`);
 * } else {
 *   console.log('Пользователь не существует');
 * }
 * 
 * @example
 * // Проверка перед регистрацией
 * const existingUser = await findUserByLogin('new_user');
 * if (existingUser) {
 *   throw new Error('Логин уже занят');
 * }
 */
export const findUserByLogin = async (login: string): Promise<User | undefined> => {
    const db = await readDB();
    return db.users.find(user => user.login === login);
};

/**
 * Создаёт нового пользователя
 * @async
 * @function createUser
 * @param {RegisterRequest} userData - Данные для регистрации
 * @param {string} userData.login - Логин пользователя
 * @param {string} userData.password - Пароль (в текущей версии хранится в открытом виде)
 * @param {string} userData.repeatPassword - Подтверждение пароля
 * @param {string} userData.phone - Номер телефона в формате +375 XX XXX XXXX
 * @returns {Promise<User>} Созданный пользователь с автоматически сгенерированным ID
 * 
 * @example
 * const newUser = await createUser({
 *   login: 'john_doe',
 *   password: 'password123',
 *   repeatPassword: 'password123',
 *   phone: '+375 29 123 4567'
 * });
 * console.log(`Создан пользователь с ID: ${newUser.id}`);
 * 
 * @example
 * // Пользователю автоматически присваивается роль 'user'
 * const user = await createUser(registerData);
 * console.log(user.role); // 'user'
 */
export const createUser = async (userData: RegisterRequest): Promise<User> => {
    const db = await readDB();
    
    // ⚠️ ВАЖНО: В реальном проекте здесь должно быть хеширование пароля
    // Например: const hashedPassword = await bcrypt.hash(userData.password, 10);
    const hashedPassword = userData.password;
    
    const newUser: User = {
        id: db.users.length + 1,
        login: userData.login,
        password: hashedPassword,
        phone: userData.phone,
        role: "user" // По умолчанию все новые пользователи имеют роль 'user'
    };
    
    db.users.push(newUser);
    await writeDB(db);
    
    return newUser;
};

/**
 * Проверяет учётные данные пользователя при входе
 * @async
 * @function validateUser
 * @param {string} login - Логин пользователя
 * @param {string} password - Пароль (в открытом виде)
 * @returns {Promise<User | null>} Пользователь при успешной валидации, иначе null
 * 
 * @example
 * const user = await validateUser('john_doe', 'password123');
 * if (user) {
 *   // Генерация JWT токена
 *   const token = jwt.sign({ id: user.id }, 'secret');
 * } else {
 *   res.status(401).json({ error: 'Invalid credentials' });
 * }
 * 
 * @example
 * // Валидация с подсчётом попыток
 * let attempts = 0;
 * const user = await validateUser(login, password);
 * if (!user) {
 *   attempts++;
 *   if (attempts >= 3) {
 *     // Блокировка аккаунта
 *   }
 * }
 */
export const validateUser = async (login: string, password: string): Promise<User | null> => {
    const user = await findUserByLogin(login);
    
    if (!user) return null;
    
    // ⚠️ ВАЖНО: В реальном проекте используйте bcrypt.compare()
    // const isValid = await bcrypt.compare(password, user.password);
    const isValid = password === user.password;
    
    return isValid ? user : null;
};

/**
 * Обновляет роль пользователя
 * @async
 * @function updateUserByRole
 * @param {number} id - ID пользователя, которому меняем роль
 * @param {"user" | "admin" | "manager"} role - Новая роль
 * @returns {Promise<User | null>} Обновлённый пользователь или null, если пользователь не найден
 * 
 * @example
 * // Повышение до администратора
 * const updatedUser = await updateUserByRole(1, 'admin');
 * if (updatedUser) {
 *   console.log(`Пользователь ${updatedUser.login} теперь администратор`);
 * }
 * 
 * @example
 * // Понижение роли
 * const demotedUser = await updateUserByRole(5, 'user');
 * 
 * @example
 * // Проверка прав перед изменением
 * const currentUser = await getUserById(currentUserId);
 * if (currentUser?.role === 'admin') {
 *   await updateUserByRole(targetUserId, newRole);
 * }
 */
export const updateUserByRole = async (id: number, role: "user" | "admin" | "manager"): Promise<User | null> => {
    const db = await readDB();

    const userIndex = db.users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;

    db.users[userIndex].role = role;

    await writeDB(db);

    return db.users[userIndex];
};

/**
 * Получает пользователя по ID
 * @async
 * @function getUserById
 * @param {number} id - ID пользователя для поиска
 * @returns {Promise<User | null>} Найденный пользователь или null, если не найден
 * 
 * @example
 * const user = await getUserById(1);
 * if (user) {
 *   console.log(`Пользователь: ${user.login}, Роль: ${user.role}`);
 * }
 * 
 * @example
 * // Использование в middleware проверки прав
 * const user = await getUserById(req.userId);
 * if (!user || user.role !== 'admin') {
 *   return res.status(403).json({ error: 'Access denied' });
 * }
 * 
 * @example
 * // Получение нескольких пользователей
 * const userIds = [1, 2, 3];
 * const users = await Promise.all(
 *   userIds.map(id => getUserById(id))
 * );
 * console.log(`Найдено ${users.filter(Boolean).length} пользователей`);
 */
export const getUserById = async (id: number): Promise<User | null> => {
    const db = await readDB();
    const user = db.users.find(u => u.id === id);
    return user || null;
};

/**
 * ⚠️ ДОПОЛНИТЕЛЬНЫЕ УТИЛИТЫ ДЛЯ USER SERVICE (рекомендуется добавить)
 */

/**
 * Обновляет данные пользователя
 * @async
 * @function updateUser
 * @param {number} id - ID пользователя
 * @param {Partial<User>} updates - Частичные данные для обновления
 * @returns {Promise<User | null>} Обновлённый пользователь или null
 * 
 * @example
 * const updated = await updateUser(1, { phone: '+375 29 999 9999' });
 */
export const updateUser = async (id: number, updates: Partial<User>): Promise<User | null> => {
    const db = await readDB();
    const userIndex = db.users.findIndex(u => u.id === id);
    
    if (userIndex === -1) return null;
    
    // Запрещаем изменение ID и пароля через этот метод
    const { id: _, password: __, ...safeUpdates } = updates;
    db.users[userIndex] = { ...db.users[userIndex], ...safeUpdates };
    
    await writeDB(db);
    return db.users[userIndex];
};

/**
 * Удаляет пользователя по ID
 * @async
 * @function deleteUser
 * @param {number} id - ID пользователя для удаления
 * @returns {Promise<boolean>} true - пользователь удалён, false - не найден
 * 
 * @example
 * const isDeleted = await deleteUser(5);
 * if (isDeleted) {
 *   console.log('Пользователь удалён');
 * }
 */
export const deleteUser = async (id: number): Promise<boolean> => {
    const db = await readDB();
    const filtered = db.users.filter(u => u.id !== id);
    
    if (filtered.length === db.users.length) return false;
    
    db.users = filtered;
    await writeDB(db);
    return true;
};