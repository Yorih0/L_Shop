import { Request, Response } from 'express';
import { findUserByLogin, createUser, validateUser } from '../services/userService';
import { RegisterRequest, LoginRequest } from '../types/User';
import jwt from "jsonwebtoken";


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
            { id: newUser.id, login: newUser.login },
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
            { id: user.id, login: user.login },
            "SECRET_KEY",
            { expiresIn: "10m" }
        );

        res.cookie("session", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 10 * 60 * 1000
        });
        res.json({ message: "Вход выполнен успешно" });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Ошибка при входе' });
    }
};

interface TokenPayload {
  id: number;
  login: string;
}

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies.session;

  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  try {
    const decoded = jwt.verify(token, "SECRET_KEY") as TokenPayload;

    res.json({
      id: decoded.id,
      login: decoded.login
    });
  } catch {
    res.status(401).json({ error: "Token expired" });
  }
};