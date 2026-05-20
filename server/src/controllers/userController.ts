import { Request, Response } from 'express';
import { findUserByLogin, createUser, validateUser, readDB, updateUserByRole } from '../services/userService';
import { User, RegisterRequest, LoginRequest } from '../types/User';
import jwt from "jsonwebtoken";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Управление пользователями (регистрация, авторизация, профиль)
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Users]
 *     description: Создаёт нового пользователя и устанавливает сессионную cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Регистрация прошла успешно
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Регистрация прошла успешно"
 *       400:
 *         description: Ошибка валидации данных
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "Все поля обязательны для заполнения"
 *                     - "Пароли не совпадают"
 *                     - "Пароль должен содержать минимум 6 символов"
 *                     - "Пользователь с таким логином уже существует"
 *                     - "Неверный формат телефона. Используйте +375 (XX) XXX XXXX"
 *       500:
 *         description: Ошибка сервера
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { login, password, repeatPassword, phone }: RegisterRequest = req.body;

        if (!login || !password || !repeatPassword || !phone) {
            res.status(400).json({ message: 'Все поля обязательны для заполнения' });
            return;
        }
        if (password !== repeatPassword) {
            res.status(400).json({ message: 'Пароли не совпадают' });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({ message: 'Пароль должен содержать минимум 6 символов' });
            return;
        }
        const existingUser = await findUserByLogin(login);
        if (existingUser) {
            res.status(400).json({ message: 'Пользователь с таким логином уже существует' });
            return;
        }
        const phoneRegex = /^\+375 \d{2} \d{3} \d{4}$/;
        if (!phoneRegex.test(phone)) {
            res.status(400).json({ message: 'Неверный формат телефона. Используйте +375 (XX) XXX XXXX' });
            return;
        }

        const newUser = await createUser({ login, password, repeatPassword, phone });

        const token = jwt.sign(
        {
            id: newUser.id,
            login: newUser.login,
            phone: newUser.phone,
            role: newUser.role
        },
        "SECRET_KEY",
        { expiresIn: "10m" }
        );

        res.cookie("session", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 10 * 60 * 1000
        });

        res.status(201).json({
            message: 'Регистрация прошла успешно'
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Ошибка при регистрации' });
    }
};

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Вход в систему
 *     tags: [Users]
 *     description: Авторизует пользователя и устанавливает сессионную cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Вход выполнен успешно
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Вход выполнен успешно"
 *       400:
 *         description: Не указаны логин или пароль
 *       401:
 *         description: Неверный логин или пароль
 *       500:
 *         description: Ошибка сервера
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { login, password }: LoginRequest = req.body;

        if (!login || !password) {
            res.status(400).json({ message: 'Логин и пароль обязательны' });
            return;
        }

        const user = await validateUser(login, password);

        if (!user) {
            res.status(401).json({ message: 'Неверный логин или пароль' });
            return;
        }

        const token = jwt.sign(
        {
            id: user.id,
            login: user.login,
            phone: user.phone,
            role: user.role
        },
        "SECRET_KEY",
        { expiresIn: "30m" }
        );

        res.cookie("session", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 30 * 60 * 1000
        });
        res.json({ message: "Вход выполнен успешно" });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Ошибка при входе' });
    }
};

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Получение данных текущего пользователя
 *     tags: [Users]
 *     description: Возвращает данные пользователя по сессионной cookie
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Данные пользователя получены успешно
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Не авторизован или токен истёк
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   enum: ["Not authenticated", "Token expired"]
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies.session;

    if (!token) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }

    try {
        const decoded = jwt.verify(token, "SECRET_KEY") as User;

        res.json({
            id: decoded.id,
            login: decoded.login,
            phone: decoded.phone,
            role: decoded.role
        });
    } catch {
        res.status(401).json({ error: "Token expired" });
    }
};

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Выход из системы
 *     tags: [Users]
 *     description: Очищает сессионную cookie и завершает сессию пользователя
 *     responses:
 *       200:
 *         description: Выход выполнен успешно
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged out"
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie("session", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/"
  });

  res.status(200).json({ message: "Logged out" });
};

/**
 * @swagger
 * /users/all:
 *   post:
 *     summary: Получение списка всех пользователей
 *     tags: [Users]
 *     description: Возвращает массив всех пользователей (требуются права администратора)
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Список пользователей получен успешно
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Ошибка сервера
 */
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await readDB();
    res.json(db.users);
  } catch (error) {
    console.error("Ошибка при получении пользователей:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

/**
 * @swagger
 * /users/{id}/role:
 *   put:
 *     summary: Изменение роли пользователя
 *     tags: [Users]
 *     description: Обновляет роль пользователя (требуются права администратора)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID пользователя
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin, manager]
 *                 description: Новая роль пользователя
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Роль успешно обновлена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Роль обновлена"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Не передана роль
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
export const setRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = Number(req.params.id);
        const {role} = req.body;
        if(!role){
            res.status(400).json({message:"Не передана роль"})
        }
        const user = await updateUserByRole(userId,role);

        if(!user){
            res.status(404).json({message:"Пользователь не найден"});
            return;
        }

        res.status(200).json({message:"Роль обновлена",user:user});
    }catch (error){
        console.error("Ошибка изменения роли пользователяй:",error);
        res.status(500).json({message: "Ошибка сервера"});
    }
};