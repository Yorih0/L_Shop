import { Request, Response } from 'express';
import { findUserByLogin, createUser, validateUser } from '../services/userService';
import { RegisterRequest, LoginRequest } from '../types/User';

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

        res.status(201).json({
            message: 'Регистрация прошла успешно',
            user: {
                id: newUser.id,
                login: newUser.login,
                phone: newUser.phone,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Ошибка при регистрации' });
    }
};

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

        res.json({
            message: 'Вход выполнен успешно',
            user: {
                id: user.id,
                login: user.login,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Ошибка при входе' });
    }
};